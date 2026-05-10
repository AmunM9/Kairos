import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import VideoGrid from '../components/VideoGrid';
import VideoDetailPanel from '../components/VideoDetailPanel';
import { useAppStore } from '../store/useAppStore';

const Results = () => {
  const query = useAppStore(state => state.query);
  const selectedVideo = useAppStore(state => state.selectedVideo);
  const selectVideo = useAppStore(state => state.selectVideo);

  return (
    <div className="w-full flex flex-col items-center min-h-full pb-20">
      <div className="w-full border-b border-border-subtle bg-bg-primary py-6 px-6 sticky top-[73px] z-40 flex justify-center">
        <div className="w-full max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SearchBar variant="hero" />
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 py-10 flex-1">
        <VideoGrid />
      </div>

      {selectedVideo && (
        <VideoDetailPanel video={selectedVideo} onClose={() => selectVideo(null)} />
      )}
    </div>
  );
};

export default Results;
