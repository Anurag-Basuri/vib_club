import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Hero from '../components/Hero';
import ClubDescription from '../components/ClubDescription.jsx';
import EventsPreview from '../components/EventsPreview';
import TeamPreview from '../components/TeamPreview';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  
  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-[#1a1f3a] text-white overflow-x-hidden"
      style={{ scale }}
    >
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:20px_20px]" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/10 filter blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500/15 filter blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-purple-500/12 filter blur-3xl animate-pulse-slow" />
      </div>
      
      <Hero />
      <ClubDescription />
      <EventsPreview />
      <TeamPreview />
      <Testimonials />
      <Footer />
    </motion.div>
  );
};

export default Home;