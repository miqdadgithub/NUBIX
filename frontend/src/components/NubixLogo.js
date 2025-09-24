import React from 'react';

const NubixLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`nubix-logo-container ${className}`}>
      {/* NUBIX Logo Icon - Based on your provided logo */}
      <div className={`${sizes[size]} nubix-logo-icon relative overflow-hidden`}>
        <svg 
          viewBox="0 0 40 40" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="nubixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="nubixGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#db8c07" />
            </linearGradient>
            <linearGradient id="nubixNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
          
          {/* Main "N" Shape - Inspired by your logo */}
          <g>
            {/* Left vertical bar */}
            <rect x="4" y="6" width="6" height="28" fill="url(#nubixGold)" rx="1"/>
            
            {/* Diagonal connecting bar */}
            <path 
              d="M 10 6 L 30 34 L 34 31 L 14 3 Z" 
              fill="url(#nubixNavy)"
            />
            
            {/* Right vertical bar */}
            <rect x="30" y="6" width="6" height="28" fill="url(#nubixNavy)" rx="1"/>
          </g>
          
          {/* Accent elements for modern touch */}
          <circle cx="8" cy="9" r="1.5" fill="#ffffff" opacity="0.8"/>
          <circle cx="32" cy="31" r="1.5" fill="#ffffff" opacity="0.8"/>
        </svg>
      </div>
      
      {/* NUBIX Text */}
      {showText && (
        <span className={`nubix-logo-text ${textSizes[size]} font-display font-bold text-secondary-900`}>
          NubiX
        </span>
      )}
    </div>
  );
};

export default NubixLogo;