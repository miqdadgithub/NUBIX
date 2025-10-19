import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../../App';
import { Phone, ArrowLeft, AlertCircle } from 'lucide-react';

const PhoneAuthScreen = () => {
  const navigate = useNavigate();
  const { phoneAuth } = useAuth();
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+249');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fullPhoneNumber = countryCode + phoneNumber;
    const result = await phoneAuth(fullPhoneNumber);
    if (result.success) {
      navigate(`/otp-verification?phone=${encodeURIComponent(fullPhoneNumber)}&verificationId=${result.verificationId}&devOtp=${result.developmentOtp}`);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: '#FAF2E6' }}>
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-full blur-3xl opacity-20"></div>
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 bg-gradient-to-tr from-secondary-900 to-secondary-500 rounded-full blur-3xl opacity-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8 fade-in-up">
          <button onClick={() => navigate(-1)} className="mr-3 p-2 text-secondary-600 hover:text-secondary-800" data-testid="phoneauth-back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="font-bold text-2xl text-secondary-900">NUBIX</span>
        </div>

        {/* Phone Icon */}
        <div className="text-center mb-8 fade-in-up" style={{ animationDelay: '60ms' }}>
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-secondary-900">{t('Phone Verification')}</h2>
          <p className="mt-2 text-secondary-600">{t('We will send you a verification code via SMS')}</p>
        </div>

        {/* Dev Notice */}
        <div className="mb-6 p-4 bg-white/70 border border-gray-200 rounded-lg backdrop-blur-md fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-secondary-600 mr-2" />
            <span className="text-secondary-800 font-medium">Development Mode</span>
          </div>
          <div className="mt-2 text-sm text-secondary-700">
            <p>Enter a Sudanese number (e.g. +249123456789).</p>
            <p>The mock API returns the verification code alongside the ID so you can complete the flow without SMS.</p>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 py-8 px-4 shadow-nubix sm:rounded-2xl sm:px-10 border border-gray-200 backdrop-blur-md fade-in-up" style={{ animationDelay: '140ms' }}>
          <form className="space-y-6" onSubmit={handleSubmit} data-testid="phoneauth-form">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-testid="phoneauth-error">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">{t('Phone Number')}</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-xl bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="phoneauth-country-code"
                >
                  <option value="+249">🇸🇩 +249</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <div className="flex-1 relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 transition-opacity duration-200 ${phoneNumber ? 'opacity-0' : 'opacity-100'}`} />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-field pl-10 py-3"
                    placeholder="123456789"
                    required
                    data-testid="phoneauth-phone-input"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary group" data-testid="phoneauth-submit">
              {loading ? <div className="loading-spinner"></div> : <span className="inline-flex items-center gap-2">Send Code <span className="transition-transform group-hover:translate-x-0.5">→</span></span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuthScreen;