import React from 'react';

const NubixLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { width: 32, height: 32, text: 'text-lg' },
    md: { width: 40, height: 40, text: 'text-xl' },
    lg: { width: 48, height: 48, text: 'text-2xl' },
    xl: { width: 64, height: 64, text: 'text-3xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* EXACT NUBIX Logo Recreation */}
      <div 
        className="relative overflow-hidden" 
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <svg 
          width={currentSize.width} 
          height={currentSize.height} 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient Definitions matching your logo exactly */}
          <defs>
            <linearGradient id="nubixGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5A623" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="nubixNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          
          {/* Recreating the exact geometric "N" from your logo */}
          <g>
            {/* Left vertical section - Gold */}
            <path 
              d="M 15 15 L 35 15 L 35 50 L 25 60 L 15 50 Z" 
              fill="url(#nubixGold)"
            />
            
            {/* Middle diagonal section - Transitioning */}
            <path 
              d="M 25 60 L 45 40 L 65 40 L 45 60 Z" 
              fill="url(#nubixGold)"
            />
            
            {/* Right vertical section - Navy */}
            <path 
              d="M 65 15 L 85 15 L 85 85 L 65 85 L 65 40 L 45 60 L 45 85 L 25 85 L 25 60 L 45 40 L 65 40 Z" 
              fill="url(#nubixNavy)"
            />
            
            {/* Top connecting piece */}
            <path 
              d="M 35 15 L 65 15 L 65 40 L 45 40 L 35 50 Z" 
              fill="url(#nubixNavy)"
            />
          </g>
          
          {/* Subtle highlights for depth */}
          <g opacity="0.3">
            <rect x="17" y="17" width="2" height="30" fill="white" />
            <rect x="67" y="17" width="2" height="30" fill="white" />
          </g>
        </svg>
      </div>
      
      {/* NUBIX Text - Matching your logo font style */}
      {showText && (
        <span 
          className={`font-display font-bold tracking-wide ${currentSize.text}`}
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            color: '#1E3A8A',
            letterSpacing: '0.5px'
          }}
        >
          NubiX
        </span>
      )}
    </div>
  );
};

export default NubixLogo;