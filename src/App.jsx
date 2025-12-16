import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from './components/Intro';
import MainLayout from './layouts/MainLayout';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';
import About from './components/About';
import Contact from './components/Contact';
import Prints from './components/Prints';
import StoreSuccess from './components/StoreSuccess';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // home, project, about, contact
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    // Check for success query param from Stripe redirect
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setCurrentView('success');
      setLoading(false); // Skip intro on success return
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Simulate initial load for intro
      const timer = setTimeout(() => {
        setLoading(false);
      }, 4000); // 4 seconds for full intro sequence
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Intro key="intro" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <MainLayout currentView={currentView} setView={setCurrentView} activeProject={activeProject}>
          <AnimatePresence mode="wait">

            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Home setView={setCurrentView} setActiveProject={setActiveProject} />
              </motion.div>
            )}

            {currentView === 'project' && activeProject && (
              <motion.div
                key="project"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProjectDetail project={activeProject} />
              </motion.div>
            )}

          </AnimatePresence>

          <AnimatePresence>
            {currentView === 'about' && <About key="about" onClose={() => setCurrentView('home')} />}
            {currentView === 'contact' && <Contact key="contact" onClose={() => setCurrentView('home')} />}
            {currentView === 'prints' && <Prints key="prints" onClose={() => setCurrentView('home')} />}
            {currentView === 'success' && <StoreSuccess key="success" setView={setCurrentView} />}
          </AnimatePresence>
        </MainLayout>
      )}
    </>
  );
}
