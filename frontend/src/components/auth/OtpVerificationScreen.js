import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, useLanguage } from '../../App';
import { MessageSquare, ArrowLeft, AlertCircle } from 'lucide-react';

const OtpVerificationScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyOtp } = useAuth();
  const { t } = useLanguage();

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
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, '');
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
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
      setError(t('Please enter the complete verification code'));
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
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#FAF2E6' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="mr-3 p-2 text-secondary-600 hover:text-secondary-800" data-testid="otp-back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="font-bold text-2xl text-secondary-900">NUBIX</span>
        </div>

        {/* SMS Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-secondary-900">{t('Enter Verification Code')}</h2>
          <p className="mt-2 text-secondary-600">{t('We sent a verification code to')}</p>
          <p className="font-semibold text-secondary-700" data-testid="otp-phone">{phoneNumber}</p>
        </div>

        {/* Development Mode Notice */}
        {devOtp && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-secondary-600 mr-2" />
              <span className="text-secondary-800 font-medium">Development Mode</span>
            </div>
            <div className="mt-2 text-sm text-secondary-700">
              <p>Use OTP: {devOtp}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4" data-testid="otp-error">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

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
                  data-testid={`otp-input-${index}`}
                />
              ))}
            </div>
          </div>

          <button onClick={() => handleSubmit()} disabled={loading || otp.some(digit => !digit)} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed" data-testid="otp-verify-button">
            {loading ? <div className="loading-spinner"></div> : t('Verify')}
          </button>

          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              {t("Didn't receive the code?")}{' '}
              {canResend ? (
                <button onClick={handleResend} className="text-secondary-700 hover:text-primary-600 font-medium" data-testid="otp-resend-button">
                  {t('Resend')}
                </button>
              ) : (
                <span className="text-secondary-500" data-testid="otp-resend-timer">
                  {t(`Resend in ${timer}s`)}
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