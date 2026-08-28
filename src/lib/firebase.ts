import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { RsvpData, GuestbookMessage, AccessPasscode } from '../types';

// Persistent Unique Device User ID generator
export const getUserDeviceId = (): string => {
  const KEY = 'boda_luz_julio_user_device_uuid_v1';
  let deviceId = localStorage.getItem(KEY);
  if (!deviceId) {
    deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(KEY, deviceId);
  }
  return deviceId;
};

// Firebase configuration from environment variables (for Vercel / local .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDNsIVtzu2qdhls3ej3KM2cyKa5yJ-WMqU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kairo-3d31d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kairo-3d31d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kairo-3d31d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "859750746656",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:859750746656:web:b4773a95aef808a2370a45",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const db = app ? getFirestore(app) : null;

// Initial default passcodes
const DEFAULT_PASSCODES: AccessPasscode[] = [
  {
    id: '1',
    code: 'LUZYJULIO',
    guestName: 'Invitación General',
    maxCompanions: 4,
    notes: 'Clave general para familiares y amigos',
    usedCount: 0,
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEYS = {
  RSVPS: 'boda_luz_julio_firebase_rsvps',
  GUESTBOOK: 'boda_luz_julio_firebase_guestbook',
  PASSCODES: 'boda_luz_julio_firebase_passcodes',
};

export const DataStore = {
  // Real-time listener for RSVPs
  subscribeToRsvps(callback: (rsvps: RsvpData[]) => void): () => void {
    if (db) {
      try {
        const q = query(collection(db, 'rsvps'), orderBy('confirmedAt', 'desc'));
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const list: RsvpData[] = [];
            querySnapshot.forEach((docSnap) => {
              list.push(docSnap.data() as RsvpData);
            });
            localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(list));
            callback(list);
          },
          (error) => {
            console.warn('Firestore realtime RSVPs subscription fallback to cache:', error);
            this.getRsvps().then(callback);
          }
        );
        return unsubscribe;
      } catch (err) {
        console.warn('Real-time subscription init error:', err);
      }
    }

    this.getRsvps().then(callback);
    return () => {};
  },

  // Real-time listener for Guestbook Messages
  subscribeToGuestbook(callback: (messages: GuestbookMessage[]) => void): () => void {
    if (db) {
      try {
        const q = query(collection(db, 'guestbook_messages'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const list: GuestbookMessage[] = [];
            querySnapshot.forEach((docSnap) => {
              list.push(docSnap.data() as GuestbookMessage);
            });
            localStorage.setItem(STORAGE_KEYS.GUESTBOOK, JSON.stringify(list));
            callback(list);
          },
          (error) => {
            console.warn('Firestore realtime Guestbook subscription fallback to cache:', error);
            this.getGuestbookMessages().then(callback);
          }
        );
        return unsubscribe;
      } catch (err) {
        console.warn('Real-time subscription init error:', err);
      }
    }

    this.getGuestbookMessages().then(callback);
    return () => {};
  },

  // RSVPs
  async getRsvps(): Promise<RsvpData[]> {
    if (db) {
      try {
        const q = query(collection(db, 'rsvps'), orderBy('confirmedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const rsvps: RsvpData[] = [];
        querySnapshot.forEach((docSnap) => {
          rsvps.push(docSnap.data() as RsvpData);
        });
        if (rsvps.length > 0) {
          localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(rsvps));
          return rsvps;
        }
      } catch (err) {
        console.warn('Firebase Firestore fetch error, using local storage fallback:', err);
      }
    }

    const local = localStorage.getItem(STORAGE_KEYS.RSVPS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return [];
      }
    }
    return [];
  },

  async getRsvpByUserDevice(deviceId: string): Promise<RsvpData | null> {
    if (!deviceId) return null;
    const rsvps = await this.getRsvps();
    const found = rsvps.find((r) => r.userDeviceId === deviceId);
    return found || null;
  },

  async saveRsvp(rsvp: RsvpData): Promise<boolean> {
    const existing = await this.getRsvps();
    const userDeviceId = rsvp.userDeviceId || getUserDeviceId();

    const newRsvp: RsvpData = {
      ...rsvp,
      id: rsvp.id || `rsvp-${Date.now()}`,
      userDeviceId: userDeviceId,
    };

    const updated = [
      newRsvp,
      ...existing.filter(
        (item) => item.id !== newRsvp.id && item.fullName.toLowerCase() !== rsvp.fullName.toLowerCase()
      ),
    ];
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(updated));

    // Also register message in guestbook if written
    if (rsvp.loveMessage && rsvp.loveMessage.trim()) {
      await this.saveGuestbookMessage({
        id: `msg-${Date.now()}`,
        name: rsvp.fullName,
        relation: 'Invitado',
        message: rsvp.loveMessage.trim(),
        likes: 1,
        createdAt: new Date().toLocaleDateString('es-PY', { day: '2-digit', month: 'short' }),
        avatarColor: '#C5A059',
        userDeviceId: userDeviceId,
      });
    }

    if (db) {
      try {
        await setDoc(doc(db, 'rsvps', newRsvp.id!), newRsvp);
      } catch (err) {
        console.warn('Firebase Firestore save error, persisted locally:', err);
      }
    }

    // Clear any previous cancellation if the user is re-submitting
    await this.clearCancellation(rsvp.phone || rsvp.fullName || userDeviceId);

    return true;
  },

  async deleteRsvp(
    id: string,
    reason: string = 'Cancelación solicitada por administración',
    guestInfo?: { fullName: string; phone?: string; userDeviceId?: string }
  ): Promise<void> {
    const existing = await this.getRsvps();
    const target = existing.find((item) => item.id === id);
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(filtered));

    const name = guestInfo?.fullName || target?.fullName || '';
    const phone = guestInfo?.phone || target?.phone || '';
    const userDeviceId = guestInfo?.userDeviceId || target?.userDeviceId || '';

    // Record cancellation reason
    const cancellationKey = (phone || name || userDeviceId || id).trim().toLowerCase();
    const cancellationData = {
      id: `cancel-${id}`,
      rsvpId: id,
      fullName: name,
      phone: phone,
      userDeviceId: userDeviceId,
      reason: reason,
      cancelledAt: new Date().toISOString(),
    };

    // Save in localStorage cancellations
    try {
      const stored = localStorage.getItem('wedding_rsvp_cancellations');
      const list = stored ? JSON.parse(stored) : {};
      list[cancellationKey] = cancellationData;
      if (userDeviceId) list[userDeviceId.toLowerCase()] = cancellationData;
      if (phone) list[phone.toLowerCase()] = cancellationData;
      if (name) list[name.toLowerCase()] = cancellationData;
      localStorage.setItem('wedding_rsvp_cancellations', JSON.stringify(list));
    } catch {
      // Ignore
    }

    if (db) {
      try {
        await deleteDoc(doc(db, 'rsvps', id));
        if (cancellationKey) {
          await setDoc(doc(db, 'rsvp_cancellations', id), cancellationData);
        }
      } catch (err) {
        console.warn('Firebase Firestore delete error:', err);
      }
    }
  },

  async checkCancellation(identifier: string): Promise<{ isCancelled: boolean; reason?: string } | null> {
    if (!identifier) return null;
    const cleanKey = identifier.trim().toLowerCase();

    // Check local storage first
    try {
      const stored = localStorage.getItem('wedding_rsvp_cancellations');
      if (stored) {
        const list = JSON.parse(stored);
        if (list[cleanKey]) {
          return { isCancelled: true, reason: list[cleanKey].reason };
        }
      }
    } catch {
      // Ignore
    }

    // Check Firebase
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'rsvp_cancellations'));
        let foundReason: string | undefined;
        querySnapshot.forEach((d) => {
          const data = d.data();
          if (
            (data.phone && data.phone.trim().toLowerCase() === cleanKey) ||
            (data.fullName && data.fullName.trim().toLowerCase() === cleanKey) ||
            (data.userDeviceId && data.userDeviceId.trim().toLowerCase() === cleanKey)
          ) {
            foundReason = data.reason;
          }
        });
        if (foundReason) {
          return { isCancelled: true, reason: foundReason };
        }
      } catch (err) {
        console.warn('Firebase check cancellation error:', err);
      }
    }

    return null;
  },

  async clearCancellation(identifier: string): Promise<void> {
    if (!identifier) return;
    const cleanKey = identifier.trim().toLowerCase();
    try {
      const stored = localStorage.getItem('wedding_rsvp_cancellations');
      if (stored) {
        const list = JSON.parse(stored);
        delete list[cleanKey];
        localStorage.setItem('wedding_rsvp_cancellations', JSON.stringify(list));
      }
    } catch {
      // Ignore
    }
  },

  // PASSCODES
  async getPasscodes(): Promise<AccessPasscode[]> {
    if (db) {
      try {
        const q = query(collection(db, 'access_passcodes'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const passcodes: AccessPasscode[] = [];
        querySnapshot.forEach((docSnap) => {
          passcodes.push(docSnap.data() as AccessPasscode);
        });
        if (passcodes.length > 0) return passcodes;
      } catch (err) {
        console.warn('Firebase passcodes fetch error:', err);
      }
    }

    const local = localStorage.getItem(STORAGE_KEYS.PASSCODES);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return DEFAULT_PASSCODES;
      }
    }
    localStorage.setItem(STORAGE_KEYS.PASSCODES, JSON.stringify(DEFAULT_PASSCODES));
    return DEFAULT_PASSCODES;
  },

  async createPasscode(passcode: Omit<AccessPasscode, 'id' | 'usedCount' | 'createdAt'>): Promise<AccessPasscode> {
    const existing = await this.getPasscodes();
    const newPasscode: AccessPasscode = {
      ...passcode,
      id: `code-${Date.now()}`,
      code: passcode.code.trim().toUpperCase(),
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [newPasscode, ...existing];
    localStorage.setItem(STORAGE_KEYS.PASSCODES, JSON.stringify(updated));

    if (db) {
      try {
        await setDoc(doc(db, 'access_passcodes', newPasscode.id), newPasscode);
      } catch (err) {
        console.warn('Firebase passcode insert error:', err);
      }
    }

    return newPasscode;
  },

  async deletePasscode(id: string): Promise<void> {
    const existing = await this.getPasscodes();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.PASSCODES, JSON.stringify(filtered));

    if (db) {
      try {
        await deleteDoc(doc(db, 'access_passcodes', id));
      } catch (err) {
        console.warn('Firebase passcode delete error:', err);
      }
    }
  },

  async validatePasscode(enteredCode: string): Promise<{ valid: boolean; isAdmin: boolean; passcode?: AccessPasscode }> {
    const clean = enteredCode.trim();

    // Check Master Admin Code
    if (clean === 'f32ZSJNr' || clean.toUpperCase() === 'F32ZSJNR') {
      return { valid: true, isAdmin: true };
    }

    const passcodes = await this.getPasscodes();
    const found = passcodes.find((p) => p.code.toUpperCase() === clean.toUpperCase());

    if (found) {
      found.usedCount += 1;
      localStorage.setItem(STORAGE_KEYS.PASSCODES, JSON.stringify(passcodes));
      return { valid: true, isAdmin: false, passcode: found };
    }

    // Default invitation code
    if (['LUZYJULIO', 'LUZ Y JULIO', 'BODA'].includes(clean.toUpperCase())) {
      return { valid: true, isAdmin: false };
    }

    return { valid: false, isAdmin: false };
  },

  // GUESTBOOK
  async getGuestbookMessages(): Promise<GuestbookMessage[]> {
    if (db) {
      try {
        const q = query(collection(db, 'guestbook_messages'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const messages: GuestbookMessage[] = [];
        querySnapshot.forEach((docSnap) => {
          messages.push(docSnap.data() as GuestbookMessage);
        });
        localStorage.setItem(STORAGE_KEYS.GUESTBOOK, JSON.stringify(messages));
        return messages;
      } catch (err) {
        console.warn('Firebase guestbook fetch error:', err);
      }
    }

    const local = localStorage.getItem(STORAGE_KEYS.GUESTBOOK);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return [];
      }
    }
    return [];
  },

  async saveGuestbookMessage(msg: GuestbookMessage): Promise<void> {
    const existing = await this.getGuestbookMessages();
    const updated = [msg, ...existing.filter((m) => m.id !== msg.id)];
    localStorage.setItem(STORAGE_KEYS.GUESTBOOK, JSON.stringify(updated));

    if (db) {
      try {
        await setDoc(doc(db, 'guestbook_messages', msg.id), msg);
      } catch (err) {
        console.warn('Firebase guestbook save error:', err);
      }
    }
  },

  async deleteGuestbookMessage(id: string): Promise<void> {
    const existing = await this.getGuestbookMessages();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.GUESTBOOK, JSON.stringify(filtered));

    if (db) {
      try {
        await deleteDoc(doc(db, 'guestbook_messages', id));
      } catch (err) {
        console.warn('Firebase guestbook delete error:', err);
      }
    }
  },
};
