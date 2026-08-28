# 🚀 Guía de Despliegue en Vercel y Configuración con Firebase

Esta guía paso a paso te explica cómo conectar la base de datos de **Firebase (Firestore)** para que las confirmaciones RSVP y dedicatorias de la boda de **Luz & Julio** se guarden en la nube en tiempo real, y cómo publicar la web en **Vercel**.

---

## 1. Configurar Firebase (Firestore)

1. Ve a la consola de Firebase: **[https://console.firebase.google.com/](https://console.firebase.google.com/)**
2. Haz clic en **"Crear un proyecto"** (o "Añadir proyecto") y nómbralo (por ejemplo: `boda-luz-julio`).
3. (Opcional) Puedes desactivar Google Analytics y pulsar **"Crear proyecto"**.
4. Una vez creado el proyecto, ve al menú lateral izquierdo y entra en:
   - **Compilación (Build)** ➔ **Firestore Database**.
   - Haz clic en **"Crear base de datos"**.
   - Selecciona la ubicación más cercana (por ejemplo `southamerica-east1` o `us-central`).
   - En la pestaña de Reglas de seguridad, selecciona **"Modo de prueba"** (o pega las reglas que te dejamos abajo).
5. En la pestaña **Reglas (Rules)** de Firestore, asegúrate de tener estas reglas para permitir guardar confirmaciones:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   Haz clic en **Publicar**.

6. **Obtener las claves de Firebase**:
   - Haz clic en el ícono de engranaje ⚙️ (junto a "Descripción general del proyecto") ➔ **Configuración del proyecto**.
   - En la sección "Tus apps", haz clic en el ícono web **`</>`**.
   - Ponle de nombre `web-invitacion` y haz clic en **Registrar app**.
   - Verás un bloque `firebaseConfig` con tus claves:
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`

---

## 2. Crear el archivo `.env` local (Opcional para pruebas)

En la raíz del proyecto `c:\Users\Usuario\Desktop\boda_cristian`, puedes crear un archivo `.env` con tus claves reales:

```env
VITE_FIREBASE_API_KEY=tu_apiKey
VITE_FIREBASE_AUTH_DOMAIN=tu_authDomain
VITE_FIREBASE_PROJECT_ID=tu_projectId
VITE_FIREBASE_STORAGE_BUCKET=tu_storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messagingSenderId
VITE_FIREBASE_APP_ID=tu_appId
```

*(Nota: La aplicación ya incluye un sistema de almacenamiento local offline inteligente que funciona perfectamente incluso antes de configurar Firebase).*

---

## 3. Subir y Desplegar en Vercel

### Opción A: Mediante GitHub (Recomendada)
1. Sube tu proyecto a un repositorio en **[https://github.com](https://github.com)**.
2. Inicia sesión en **[https://vercel.com](https://vercel.com)** con tu cuenta de GitHub.
3. Haz clic en **"Add New..."** ➔ **"Project"**.
4. Importa el repositorio de la boda `boda_cristian`.
5. En la pantalla de configuración antes de pulsar "Deploy":
   - Despliega la sección **"Environment Variables"**.
   - Agrega cada una de las variables de Firebase:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
6. Haz clic en **"Deploy"**. En unos 30 segundos tu web estará en vivo con un enlace HTTPS gratuito (ej. `boda-luz-julio.vercel.app`) y certificado SSL automático.

---

## 4. Acceso Exclusivo al Panel de Administración

- Para acceder al panel privado de Luz & Julio desde cualquier dispositivo o navegador:
  - Ingresa a la URL añadiendo `/#admin` o `/?admin=true` al final:
    **`https://tu-web-de-boda.vercel.app/#admin`**
  - Escribe la clave maestra: **`f32ZSJNr`**
  - Podrás ver:
    - Lista de invitados confirmados.
    - Total de acompañantes calculados.
    - Muro de dedicatorias.
    - **Botón para exportar todas las confirmaciones a Excel / CSV con 1 clic**.
