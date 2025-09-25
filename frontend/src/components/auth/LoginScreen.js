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
    <div className="min-h-screen flex flex-col justify-center py-16 px-6" style={{ backgroundColor: '#FAF2E6' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-12">
          <NubixLogo size="lg" showText={true} />
        </div>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-display font-bold text-secondary-900 mb-4">
            Welcome Back!
          </h2>
          <p className="text-secondary-600 text-lg">
            Sign in to access your cryptocurrency trading account
          </p>
        </div>
        {/* Dev notice */}
        <div className="mb-8 nubix-card bg-gray-50 border border-gray-300">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-secondary-500 mr-2" />
            <span className="text-secondary-800 font-semibold">Development Mode</span>
          </div>
          <div className="text-sm text-secondary-700 space-y-1">
            <p className="font-medium">Email: test@nubix.com | Password: 123456</p>
            <p className="font-medium">Email: admin@nubix.com | Password: admin123</p>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="nubix-card">
          <form className="space-y-8" onSubmit={handleSubmit} data-testid="login-form">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4" data-testid="login-error">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="nubix-input pl-12 py-4"
                  placeholder="Enter your email address"
                  required
                  data-testid="login-email-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-secondary-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="nubix-input pl-12 pr-12 py-4"
                  placeholder="Enter your password"
                  required
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-secondary-700 nubix-transition"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium nubix-transition" data-testid="forgot-password-link">
                Forgot Password?
              </button>
            </div>

            <div className="space-y-4">
              <button type="submit" disabled={loading} className="w-full nubix-btn-primary text-lg py-4" data-testid="login-submit-button">
                {loading ? <div className="nubix-spinner" /> : 'Sign In'}
              </button>
              <Link to="/phone-auth" className="w-full nubix-btn-secondary text-lg py-4" data-testid="phone-auth-link">
                <Phone className="w-5 h-5 mr-2" />
                Sign in with Phone
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-secondary-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-secondary-700 hover:text-primary-600 font-semibold nubix-transition" data-testid="go-to-register">
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