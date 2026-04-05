import React from 'react';

const PageLoader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    // The wrapper ensures the loader covers the whole screen and centers its content
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-bg-primary bg-opacity-80 z-50 backdrop-blur-sm transition-all">
      {/* The animated spinner */}
      <div className="w-16 h-16 border-4 border-bg-secondary border-t-text-primary rounded-full animate-spin mb-4"></div>

      {/* Optional loading text */}
      <p className="text-text-primary text-[18px] font-medium animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default PageLoader;
