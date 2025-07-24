import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const visionaries = [
  {
    quote: "The computer was born to solve problems that did not exist before.",
    author: "Bill Gates",
    role: "Co-founder of Microsoft",
    color: "from-cyan-500/10 to-blue-500/10"
  },
  {
    quote: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    role: "Co-founder of Apple",
    color: "from-purple-500/10 to-fuchsia-500/10"
  },
  {
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    role: "Computer Scientist",
    color: "from-emerald-500/10 to-teal-500/10"
  },
  {
    quote: "Technology is anything that wasn't around when you were born.",
    author: "Alan Perlis",
    role: "Computer Scientist",
    color: "from-amber-500/10 to-orange-500/10"
  },
  {
    quote: "The most dangerous phrase in the language is, 'We've always done it this way.'",
    author: "Grace Hopper",
    role: "Computer Pioneer",
    color: "from-rose-500/10 to-pink-500/10"
  }
];

const QUOTE_DURATION = 8000;

const VisionaryCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % visionaries.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? visionaries.length - 1 : prev - 1));
  };

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(next, QUOTE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 relative z-10 overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 18 + 8}px`,
              height: `${Math.random() * 18 + 8}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() > 0.5 ? -15 : 15, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Luminaries' Lens
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Timeless wisdom from the minds who shaped the digital age.
          </motion.p>
        </div>

        <div className="relative h-[350px] md:h-[280px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className={`bg-gradient-to-br ${visionaries[current].color} backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full shadow-2xl`}
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow relative">
                  <motion.div 
                    className="absolute -top-6 -left-6 text-8xl text-blue-400 opacity-10 select-none"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    “
                  </motion.div>
                  <p className="text-2xl md:text-3xl font-light text-white mb-6 leading-relaxed">
                    {visionaries[current].quote}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="font-bold text-white text-xl">{visionaries[current].author}</div>
                  <div className="text-blue-300 opacity-80">{visionaries[current].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {visionaries.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              aria-label={`Show quote ${idx + 1}`}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === current 
                  ? 'bg-blue-400 scale-125' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8 gap-6">
          <motion.button 
            onClick={prev}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous quote"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.button 
            onClick={next}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next quote"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-blue-500/5 to-cyan-500/5 blur-3xl -z-1 pointer-events-none"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-3xl -z-1 pointer-events-none"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </section>
  );
};

export default VisionaryCarousel;