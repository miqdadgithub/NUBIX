import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../../App';
import { Phone, ArrowLeft, AlertCircle } from 'lucide-react';

const PhoneAuthScreen = () => {
  const navigate = useNavigate();
  const { phoneAuth } = useAuth();
  const { t, isArabic } = useLanguage();
  
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="font-bold text-2xl text-gray-900">NUBIX</span>
        </div>

        {/* Phone Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-10 h-10 text-primary-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            {t('Phone Verification', 'التحقق من الهاتف')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('We will send you a verification code via SMS', 'سنرسل لك رمز التحقق عبر الرسائل القصيرة')}
          </p>
        </div>

        {/* Development Mode Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Development Mode</span>
          </div>
          <div className="mt-2 text-sm text-blue-700">
            <p>Use: +249123456789 or +249987654321</p>
            <p>OTP: 123456</p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Phone Number', 'رقم الهاتف')}
              </label>
              
              <div className="flex space-x-2">
                {/* Country Code Dropdown */}
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="+249">🇸🇩 +249</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>

                {/* Phone Number Input */}
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-field pl-10"
                    placeholder="123456789"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                t('Send Code', 'إرسال الرمز')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuthScreen;