import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';

const Landing = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', staggerChildren: 0.1 }}
      className="flex flex-col items-center w-full max-w-3xl px-6 pt-12 pb-32"
    >
      <motion.h2 
        className="font-display text-5xl md:text-6xl text-center text-text-primary tracking-[-0.02em] mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Busca referencias visuales
      </motion.h2>

      <motion.div
        className="w-full relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <SearchBar variant="hero" />
      </motion.div>

      <motion.p
        className="font-display italic text-text-tertiary mt-16 text-lg opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        "El momento exacto, en imágenes."
      </motion.p>
    </motion.div>
  );
};

export default Landing;
