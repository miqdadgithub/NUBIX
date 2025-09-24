import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../../App';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, AlertCircle } from 'lucide-react';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, toggleLanguage, isArabic } = useLanguage();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('Passwords do not match', 'كلمات المرور غير متطابقة'));
      setLoading(false);
      return;
    }

    // Validate terms acceptance
    if (!formData.acceptTerms) {
      setError(t('Please accept the terms and conditions', 'يرجى الموافقة على الشروط والأحكام'));
      setLoading(false);
      return;
    }

    const result = await register(
      formData.fullName,
      formData.email,
      formData.password,
      formData.phoneNumber
    );
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
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
          <button
            onClick={toggleLanguage}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {isArabic ? 'English' : 'العربية'}
          </button>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('Create New Account', 'إنشاء حساب جديد')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('Join NUBIX to start trading cryptocurrencies', 'انضم إلى نوبكس لبدء تداول العملات المشفرة')}
          </p>
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

            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Full Name', 'الاسم الكامل')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder={t('Enter your full name', 'أدخل اسمك الكامل')}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Email', 'البريد الإلكتروني')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder={t('Enter your email', 'أدخل بريدك الإلكتروني')}
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Phone Number', 'رقم الهاتف')} ({t('Optional', 'اختياري')})
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder={t('+249123456789', '+249123456789')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Password', 'كلمة المرور')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder={t('Enter your password', 'أدخل كلمة المرور')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Confirm Password', 'تأكيد كلمة المرور')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder={t('Confirm your password', 'أكد كلمة المرور')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
                required
              />
              <label className="ml-3 text-sm text-gray-700">
                {t('I agree to the', 'أوافق على')}{' '}
                <button type="button" className="text-primary-600 hover:text-primary-500 underline">
                  {t('Terms and Conditions', 'الشروط والأحكام')}
                </button>
                {' '}{t('and', 'و')}{' '}
                <button type="button" className="text-primary-600 hover:text-primary-500 underline">
                  {t('Privacy Policy', 'سياسة الخصوصية')}
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.acceptTerms}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                t('Create Account', 'إنشاء حساب')
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('Already have an account?', 'تملك حساباً بالفعل؟')}{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                {t('Sign In', 'تسجيل الدخول')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;