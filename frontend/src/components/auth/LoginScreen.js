import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { Eye, EyeOff, Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import NubixLogo from '../NubixLogo';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-16 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header with better spacing */}
        <div className="flex justify-center mb-12">
          <NubixLogo size="lg" showText={true} />
        </div>

        {/* Welcome Text with improved spacing */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Welcome Back!
          </h2>
          <p className="text-gray-600 text-lg">
            Sign in to access your cryptocurrency trading account
          </p>
        </div>

        {/* Development Mode Notice */}
        <div className="mb-8 nubix-card bg-blue-50 border border-blue-200">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-semibold">Development Mode</span>
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <p className="font-medium">Email: test@nubix.com | Password: 123456</p>
            <p className="font-medium">Email: admin@nubix.com | Password: admin123</p>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="nubix-card">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Email Field with better spacing */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
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
                />
              </div>
            </div>

            {/* Password Field with better spacing */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 nubix-transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium nubix-transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button with better spacing */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full nubix-btn-primary text-lg py-4"
              >
                {loading ? (
                  <div className="nubix-spinner"></div>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Phone Auth Button */}
              <Link
                to="/phone-auth"
                className="w-full nubix-btn-secondary text-lg py-4"
              >
                <Phone className="w-5 h-5 mr-2" />
                Sign in with Phone
              </Link>
            </div>
          </form>

          {/* Register Link with better spacing */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-500 font-semibold nubix-transition">
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