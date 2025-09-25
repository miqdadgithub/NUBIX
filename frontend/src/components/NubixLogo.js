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
    <div className={`flex items-center ${showText ? 'space-x-3' : ''} ${className}`} data-testid="nubix-logo">
      {/* Brand Logo */}
      <div 
        className="relative flex items-center justify-center" 
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <svg 
          width={currentSize.width} 
          height={currentSize.height} 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
          aria-label="NubiX logo"
        >
          <defs>
            <linearGradient id="nubixGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CD9613" />
              <stop offset="100%" stopColor="#DAB157" />
            </linearGradient>
            <linearGradient id="nubixNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#011C3C" />
              <stop offset="100%" stopColor="#0A2644" />
            </linearGradient>
          </defs>
          <g>
            <path d="M 20 20 L 35 20 L 35 60 L 30 65 L 20 55 Z" fill="url(#nubixGold)" />
            <path d="M 30 65 L 50 45 L 70 45 L 50 65 Z" fill="url(#nubixGold)" />
            <path d="M 65 20 L 80 20 L 80 80 L 65 80 L 65 45 L 50 65 L 50 80 L 30 80 L 30 65 L 50 45 L 65 45 Z" fill="url(#nubixNavy)" />
            <path d="M 35 20 L 65 20 L 65 45 L 50 45 L 35 60 Z" fill="url(#nubixNavy)" />
          </g>
        </svg>
      </div>
      {showText && (
        <span 
          className={`font-bold tracking-wide ${currentSize.text}`}
          style={{ fontFamily: 'Poppins, sans-serif', color: '#011C3C', letterSpacing: '1px' }}
        >
          NubiX
        </span>
      )}
    </div>
  );
};

export default NubixLogo;