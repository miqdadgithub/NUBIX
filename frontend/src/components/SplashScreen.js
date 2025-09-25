import React from 'react';

const SplashScreen = () => {
  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center" data-testid="splash-screen">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-white/20 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
            <span className="text-6xl font-bold text-white">N</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">NUBIX</h1>
          <p className="text-white/90 text-lg">Your Gateway to Cryptocurrency</p>
        </div>
        <div className="loading-spinner mx-auto"></div>
        <div className="mt-8">
          <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm">
            Development Mode
          </span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;