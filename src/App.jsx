import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from './components/Intro';
import MainLayout from './layouts/MainLayout';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';
import About from './components/About';
import Contact from './components/Contact';
import Prints from './components/Prints';
import StoreSuccess from './components/StoreSuccess';
import { DATA } from './data/projects';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for success query param from Stripe redirect
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      navigate('/success', { replace: true });
      setLoading(false); // Skip intro on success return
    } else {
      // Simulate initial load for intro
      const timer = setTimeout(() => {
        setLoading(false);
      }, 4000); // 4 seconds for full intro sequence
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  // Update active project based on route
  useEffect(() => {
    const match = location.pathname.match(/\/project\/([^/]+)/);
    if (match) {
      const project = DATA.projects.find(p => p.id === match[1]);
      setActiveProject(project);
    } else if (location.pathname === '/') {
      // Home handles its own active project via scroll
    } else {
      setActiveProject(null);
    }
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Intro key="intro" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <MainLayout activeProject={activeProject}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Home setActiveProject={setActiveProject} />
                </motion.div>
              } />
              <Route path="/project/:projectId" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProjectDetail />
                </motion.div>
              } />
              <Route path="/about" element={<About key="about" />} />
              <Route path="/contact" element={<Contact key="contact" />} />
              <Route path="/prints" element={<Prints key="prints" />} />
              <Route path="/success" element={<StoreSuccess key="success" />} />
            </Routes>
          </AnimatePresence>
        </MainLayout>
      )}
    </>
  );
}
