import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Preloader from './components/common/Preloader';
import LuxuryBrandHero from './components/landing/LuxuryBrandHero';
import VantaCloudsBackground from './components/reactbits/VantaCloudsBackground';
import GradualBlur from './components/reactbits/GradualBlur';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import CinematicInvitation from './components/sections/CinematicInvitation';
import RsvpSection from './components/sections/RsvpSection';
import GuestbookSection from './components/sections/GuestbookSection';
import FooterSection from './components/sections/FooterSection';
import FloatingNav from './components/sections/FloatingNav';
import MusicPlayer from './components/sections/MusicPlayer';
import { ArrowLeft } from 'lucide-react';
import { sound } from './utils/soundEffects';
import { weddingAudio } from './utils/audioController';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'hero' | 'invitation' | 'adminLogin' | 'adminDashboard'>('hero');

  // Control audio playback: strictly active only in the invitation ("la carta") and disabled in admin / hero
  useEffect(() => {
    if (currentView === 'invitation') {
      weddingAudio.enablePlayback();
      weddingAudio.play();
    } else {
      weddingAudio.disablePlayback();
    }
  }, [currentView]);

  // Check URL query parameters / hash for /admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isPathAdmin = window.location.pathname.includes('/admin') || window.location.hash.includes('admin') || urlParams.get('admin') === 'true';

      if (isPathAdmin) {
        const isAuth = sessionStorage.getItem('wedding_admin_session_auth') === 'true';
        if (isAuth) {
          setCurrentView('adminDashboard');
        } else {
          setCurrentView('adminLogin');
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);
    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  const handleOpenInvitation = () => {
    sound.playClick();
    setCurrentView('invitation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHero = () => {
    sound.playClick();
    setCurrentView('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setCurrentView('adminDashboard');
  };

  const handleExitAdmin = () => {
    sessionStorage.removeItem('wedding_admin_session_auth');
    if (window.location.hash.includes('admin') || window.location.search.includes('admin')) {
      window.history.pushState(null, '', '/');
    }
    setCurrentView('hero');
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Smart Preloader for Mobile & Desktop */}
      {isLoading && (
        <Preloader onLoaded={() => setIsLoading(false)} />
      )}

      {/* 1. Full-Viewport Luxury Video Hero Landing */}
      {currentView === 'hero' && (
        <LuxuryBrandHero
          onOpenInvitation={handleOpenInvitation}
        />
      )}

      {/* 2. Exclusive Admin Login Screen (Accessed via /#admin) */}
      {currentView === 'adminLogin' && (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onCancel={handleExitAdmin}
        />
      )}

      {/* 3. Exclusive Admin Dashboard (Unlocked with f32ZSJNr) */}
      {currentView === 'adminDashboard' && (
        <AdminDashboard onExit={handleExitAdmin} />
      )}

      {/* 4. Wedding Invitation with Vanta 3D Clouds Background */}
      {currentView === 'invitation' && (
        <VantaCloudsBackground>
          {/* Hollywood Anamorphic Lens Depth of Field */}
          <GradualBlur position="both" height="130px" />

          {/* Top Return to Landing Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-5 left-5 z-40 flex items-center gap-2"
          >
            <button
              onClick={handleBackToHero}
              className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white text-xs font-serif shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
              title="Volver a la portada principal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portada</span>
            </button>
          </motion.div>

          {/* Floating Music & Navigation */}
          <MusicPlayer />
          <FloatingNav onBackToCover={handleBackToHero} />

          {/* Main Content Flow */}
          <main className="relative z-10">
            <CinematicInvitation />
            <RsvpSection />
            <GuestbookSection />
            <FooterSection />
          </main>
        </VantaCloudsBackground>
      )}
    </div>
  );
};

export default App;
