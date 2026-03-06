import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-zinc-50">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_50%)]" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block text-brand font-semibold tracking-wider uppercase text-sm mb-4"
        >
          New Arrival
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6"
        >
          The Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-600">
            Personal Tech.
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Experience innovation like never before. TechtopiaPK brings you the most 
          advanced gadgets with a design that speaks for itself.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="btn-primary flex items-center gap-2 group">
            Shop Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="btn-secondary">
            Learn More
          </button>
        </motion.div>
      </div>

      {/* Hero Image / Decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-1/2 pointer-events-none"
      >
        <div className="w-full h-full bg-gradient-to-t from-white via-transparent to-transparent z-20 absolute inset-0" />
        <img 
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200" 
          alt="MacBook Pro"
          className="w-full h-full object-cover rounded-t-3xl shadow-2xl opacity-40"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </section>
  );
};
