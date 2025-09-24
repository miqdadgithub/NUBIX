import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import { Bitcoin, Shield, CreditCard } from 'lucide-react';
import NubixLogo from './NubixLogo';

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      icon: Bitcoin,
      title: 'Welcome to NubiX',
      description: 'Your trusted platform for buying cryptocurrency with Sudanese Pounds through secure transactions.',
      color: 'text-primary-500'
    },
    {
      icon: Shield,
      title: 'Secure Trading',
      description: 'Advanced security features with KYC verification and multi-factor authentication for your protection.',
      color: 'text-success'
    },
    {
      icon: CreditCard,
      title: 'Bank Integration',
      description: 'Seamless integration with Bank of Khartoum through Bankak payment system for easy transactions.',
      color: 'text-secondary-600'
    }
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with better spacing */}
      <div className="flex justify-between items-center p-8">
        <NubixLogo size="md" showText={true} />
        
        <button
          onClick={handleComplete}
          className="text-primary-600 font-medium hover:text-primary-700 nubix-transition bg-white px-6 py-2 rounded-full shadow-nubix"
        >
          Skip
        </button>
      </div>

      {/* Content with improved spacing */}
      <div className="flex-1 flex flex-col justify-center px-8 py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Icon with better spacing */}
          <div className="mb-12">
            <div className="w-28 h-28 bg-white rounded-3xl shadow-nubix-lg flex items-center justify-center mx-auto mb-8">
              {React.createElement(pages[currentPage].icon, {
                size: 56,
                className: pages[currentPage].color
              })}
            </div>
          </div>

          {/* Title with improved typography */}
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6 leading-tight">
            {pages[currentPage].title}
          </h1>

          {/* Description with better spacing */}
          <p className="text-gray-600 text-xl leading-relaxed px-4">
            {pages[currentPage].description}
          </p>
        </div>
      </div>

      {/* Bottom Navigation with improved spacing */}
      <div className="p-8">
        {/* Page Indicators */}
        <div className="flex justify-center mb-8">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-2 nubix-transition ${
                currentPage === index 
                  ? 'bg-primary-500 w-10' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons with better spacing */}
        <div className="max-w-md mx-auto">
          <div className="flex space-x-4">
            {currentPage > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 nubix-btn-secondary rounded-2xl py-4 text-lg"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 nubix-btn-primary rounded-2xl py-4 text-lg"
            >
              {currentPage === pages.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;