import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { Eye, EyeOff, Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import NubixLogo from '../NubixLogo';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-16 px-6 overflow-hidden" style={{ backgroundColor: '#FAF2E6' }}>
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-full blur-3xl opacity-20"></div>
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 bg-gradient-to-tr from-secondary-900 to-secondary-500 rounded-full blur-3xl opacity-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="flex justify-center mb-12 animate-float-slow" data-testid="login-logo">
          <NubixLogo size="lg" showText={true} />
        </div>
        <div className="text-center mb-10 fade-in-up">
          <h2 className="text-4xl font-display font-bold text-secondary-900 mb-3 tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-secondary-600 text-base sm:text-lg">
            Sign in to access your cryptocurrency trading account
          </p>
        </div>
        {/* Dev notice */}
        <div className="mb-8 nubix-card bg-white/70 backdrop-blur-md border border-gray-200 fade-in-up" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-secondary-600 mr-2" />
            <span className="text-secondary-800 font-semibold">Development Mode</span>
          </div>
          <div className="text-sm text-secondary-700 space-y-1">
            <p className="font-medium">Email: test@nubix.com | Password: 123456</p>
            <p className="font-medium">Email: admin@nubix.com | Password: admin123</p>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-nubix rounded-2xl p-8 sm:p-10 fade-in-up" style={{ animationDelay: '120ms' }}>
          <form className="space-y-7" onSubmit={handleSubmit} data-testid="login-form">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4" data-testid="login-error">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-700">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 transition-opacity duration-200 ${formData.email ? 'opacity-0' : 'opacity-100'}`}
                  aria-hidden
                />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="nubix-input pl-12 py-4 focus:shadow-nubix"
                  placeholder="Enter your email address"
                  required
                  data-testid="login-email-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-700">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 transition-opacity duration-200 ${formData.password ? 'opacity-0' : 'opacity-100'}`}
                  aria-hidden
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="nubix-input pl-12 pr-12 py-4 focus:shadow-nubix"
                  placeholder="Enter your password"
                  required
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-700 transition-colors"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium transition-colors" data-testid="forgot-password-link">
                Forgot Password?
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full nubix-btn-primary text-lg py-4 group"
                data-testid="login-submit-button"
              >
                {loading ? (
                  <div className="nubix-spinner" />
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Sign In
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                )}
              </button>
              <Link to="/phone-auth" className="w-full nubix-btn-secondary text-lg py-4 group" data-testid="phone-auth-link">
                <Phone className="w-5 h-5 mr-2" />
                <span className="inline-flex items-center gap-2">Sign in with Phone <span className="transition-transform group-hover:translate-x-0.5">→</span></span>
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center fade-in-up" style={{ animationDelay: '160ms' }}>
            <p className="text-secondary-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-secondary-700 hover:text-primary-600 font-semibold transition-colors" data-testid="go-to-register">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;