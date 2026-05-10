import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import VideoGrid from '../components/VideoGrid';
import { useAppStore } from '../store/useAppStore';

const Results = () => {
  const query = useAppStore(state => state.query);

  return (
    <div className="w-full flex flex-col items-center min-h-full pb-20">
      <div className="w-full border-b border-border-subtle bg-bg-primary pt-6 pb-6 px-6 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <motion.div 
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SearchBar variant="compact" />
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 py-10 flex-1">
        <VideoGrid />
      </div>
    </div>
  );
};

export default Results;
