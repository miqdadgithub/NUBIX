import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, AlertCircle } from 'lucide-react';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
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
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: '#FAF2E6' }}>
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-full blur-3xl opacity-20"></div>
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 bg-gradient-to-tr from-secondary-900 to-secondary-500 rounded-full blur-3xl opacity-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 fade-in-up">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-3 p-2 text-secondary-600 hover:text-secondary-800" data-testid="register-back">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-2xl text-secondary-900">NUBIX</span>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8 fade-in-up" style={{ animationDelay: '60ms' }}>
          <h2 className="text-3xl font-bold text-secondary-900">Create New Account</h2>
          <p className="mt-2 text-secondary-600">Join NubiX to start trading cryptocurrencies</p>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-nubix rounded-2xl p-8 sm:p-10 fade-in-up" style={{ animationDelay: '120ms' }}>
          <form className="space-y-6" onSubmit={handleSubmit} data-testid="register-form">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-testid="register-error">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 transition-opacity duration-200 ${formData.fullName ? 'opacity-0' : 'opacity-100'}`} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field pl-10 py-3"
                  placeholder="Enter your full name"
                  required
                  data-testid="register-fullname-input"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 transition-opacity duration-200 ${formData.email ? 'opacity-0' : 'opacity-100'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10 py-3"
                  placeholder="Enter your email"
                  required
                  data-testid="register-email-input"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 transition-opacity duration-200 ${formData.phoneNumber ? 'opacity-0' : 'opacity-100'}`} />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="input-field pl-10 py-3"
                  placeholder="+249123456789"
                  data-testid="register-phone-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 transition-opacity duration-200 ${formData.password ? 'opacity-0' : 'opacity-100'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10 py-3"
                  placeholder="Enter your password"
                  required
                  data-testid="register-password-input"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-700" data-testid="register-toggle-password">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 transition-opacity duration-200 ${formData.confirmPassword ? 'opacity-0' : 'opacity-100'}`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10 py-3"
                  placeholder="Confirm your password"
                  required
                  data-testid="register-confirm-password-input"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-700" data-testid="register-toggle-confirm-password">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
                required
                data-testid="register-accept-terms"
              />
              <label className="ml-3 text-sm text-secondary-700">
                I agree to the <button type="button" className="text-secondary-700 hover:text-primary-600 underline">Terms and Conditions</button> and <button type="button" className="text-secondary-700 hover:text-primary-600 underline">Privacy Policy</button>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || !formData.acceptTerms} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed group" data-testid="register-submit-button">
              {loading ? <div className="loading-spinner"></div> : <span className="inline-flex items-center gap-2">Create Account <span className="transition-transform group-hover:translate-x-0.5">→</span></span>}
            </button>
          </form>

          <div className="mt-6 text-center fade-in-up" style={{ animationDelay: '160ms' }}>
            <p className="text-secondary-600">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary-700 hover:text-primary-600 font-medium" data-testid="register-go-to-login">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;