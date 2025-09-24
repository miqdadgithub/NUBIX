import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, useLanguage } from '../../App';
import { MessageSquare, ArrowLeft, AlertCircle } from 'lucide-react';

const OtpVerificationScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyOtp } = useAuth();
  const { t, isArabic } = useLanguage();
  
  const phoneNumber = searchParams.get('phone') || '';
  const verificationId = searchParams.get('verificationId') || '';
  const devOtp = searchParams.get('devOtp') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (otpValue = null) => {
    const otpToVerify = otpValue || otp.join('');
    
    if (otpToVerify.length !== 6) {
      setError(t('Please enter the complete verification code', 'يرجى إدخال رمز التحقق كاملاً'));
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyOtp(phoneNumber, otpToVerify);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      // Focus first input
      inputRefs.current[0]?.focus();
    }
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

        {/* SMS Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-primary-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            {t('Enter Verification Code', 'أدخل رمز التحقق')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('We sent a verification code to', 'لقد أرسلنا رمز التحقق إلى')}
          </p>
          <p className="font-semibold text-primary-600">{phoneNumber}</p>
        </div>

        {/* Development Mode Notice */}
        {devOtp && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Development Mode</span>
            </div>
            <div className="mt-2 text-sm text-blue-700">
              <p>Use OTP: {devOtp}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* OTP Input Fields */}
          <div className="mb-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  maxLength={1}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={loading || otp.some(digit => !digit)}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              t('Verify', 'تحقق')
            )}
          </button>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t("Didn't receive the code?", 'لم تستلم الرمز؟')}{' '}
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  {t('Resend', 'إعادة الإرسال')}
                </button>
              ) : (
                <span className="text-gray-500">
                  {t(`Resend in ${timer}s`, `إعادة الإرسال خلال ${timer}s`)}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationScreen;