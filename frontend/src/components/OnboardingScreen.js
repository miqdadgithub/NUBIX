import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import { Bitcoin, Shield, CreditCard, Globe } from 'lucide-react';
import NubixLogo from './NubixLogo';

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const { t, setEnglish, setArabic, completeOnboarding } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      icon: Bitcoin,
      title: t('Welcome to NubiX', 'مرحباً بك في نوبيكس'),
      description: t(
        'Your trusted platform for buying cryptocurrency with Sudanese Pounds',
        'منصتك الموثوقة لشراء العملات المشفرة بالجنيه السوداني'
      ),
      color: 'text-primary-500'
    },
    {
      icon: Shield,
      title: t('Secure Trading', 'تداول آمن'),
      description: t(
        'Advanced security features with KYC verification and multi-factor authentication',
        'ميزات أمان متقدمة مع التحقق من الهوية والمصادقة متعددة العوامل'
      ),
      color: 'text-success'
    },
    {
      icon: CreditCard,
      title: t('Bank Integration', 'تكامل مصرفي'),
      description: t(
        'Seamless integration with Bank of Khartoum through Bankak payment system',
        'تكامل سلس مع بنك الخرطوم من خلال نظام بنكك للدفع'
      ),
      color: 'text-secondary-600'
    },
    {
      icon: Globe,
      title: t('Choose Your Language', 'اختر لغتك'),
      description: t(
        'Select your preferred language to get started',
        'اختر لغتك المفضلة للبدء'
      ),
      color: 'text-primary-600'
    }
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLanguageSelect = (lang) => {
    if (lang === 'ar') {
      setArabic();
    } else {
      setEnglish();
    }
    completeOnboarding();
    navigate('/login');
  };

  const skipToLanguage = () => {
    setCurrentPage(pages.length - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <NubixLogo size="md" showText={true} />
        
        {currentPage < pages.length - 1 && (
          <button
            onClick={skipToLanguage}
            className="text-primary-600 font-medium hover:text-primary-700 nubix-transition"
          >
            {t('Skip', 'تخطي')}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        {currentPage < pages.length - 1 ? (
          <div className="max-w-md mx-auto text-center">
            {/* Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-nubix flex items-center justify-center mx-auto mb-6">
                {React.createElement(pages[currentPage].icon, {
                  size: 48,
                  className: pages[currentPage].color
                })}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
              {pages[currentPage].title}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {pages[currentPage].description}
            </p>
          </div>
        ) : (
          /* Language Selection Page */
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-nubix flex items-center justify-center mx-auto mb-6">
                <Globe size={48} className="text-primary-600" />
              </div>
            </div>

            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Choose Your Language
            </h1>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
              اختر لغتك المفضلة
            </h1>

            <div className="space-y-4">
              <button
                onClick={() => handleLanguageSelect('en')}
                className="w-full nubix-btn-primary text-lg py-4 rounded-2xl"
              >
                <span className="mr-3">🇺🇸</span>
                English
              </button>
              <button
                onClick={() => handleLanguageSelect('ar')}
                className="w-full nubix-btn-secondary text-lg py-4 rounded-2xl"
              >
                <span className="mr-3">🇸🇩</span>
                العربية
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="p-6">
        {/* Page Indicators */}
        <div className="flex justify-center mb-6">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 nubix-transition ${
                currentPage === index 
                  ? 'bg-primary-500 w-8' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        {currentPage < pages.length - 1 && (
          <div className="flex space-x-4">
            {currentPage > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 nubix-btn-secondary rounded-2xl"
              >
                {t('Previous', 'السابق')}
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 nubix-btn-primary rounded-2xl"
            >
              {currentPage === pages.length - 2 ? t('Continue', 'متابعة') : t('Next', 'التالي')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;