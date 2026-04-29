import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Courses from '../components/Courses';
import CodePreview from '../components/CodePreview';
import About from '../components/About';

import { motion } from 'framer-motion';

const VyKodHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <main>
        <Hero />
        <Features />
        <Courses />
        <CodePreview />
        <About />
      </main>
      

      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>
    </div>
  );
};

export default VyKodHome;