import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../../App';
import { Eye, EyeOff, Mail, Lock, Phone, AlertCircle } from 'lucide-react';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, toggleLanguage, isArabic } = useLanguage();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
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
            {t('Welcome Back!', 'مرحباً بعودتك!')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('Sign in to access your account', 'سجل الدخول للوصول إلى حسابك')}
          </p>
        </div>

        {/* Development Mode Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Development Mode</span>
          </div>
          <div className="mt-2 text-sm text-blue-700">
            <p>Use: test@nubix.com / 123456</p>
            <p>Or: admin@nubix.com / admin123</p>
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

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                {t('Forgot Password?', 'نسيت كلمة المرور؟')}
              </button>
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
                t('Sign In', 'تسجيل الدخول')
              )}
            </button>

            {/* Phone Auth Button */}
            <Link
              to="/phone-auth"
              className="w-full btn-secondary"
            >
              <Phone className="w-5 h-5 mr-2" />
              {t('Sign in with Phone', 'الدخول برقم الهاتف')}
            </Link>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t("Don't have an account?", 'لا تملك حساباً؟')}{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                {t('Sign Up', 'إنشاء حساب')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;