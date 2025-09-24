import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import LoginScreen from './components/auth/LoginScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import PhoneAuthScreen from './components/auth/PhoneAuthScreen';
import OtpVerificationScreen from './components/auth/OtpVerificationScreen';
import HomeScreen from './components/home/HomeScreen';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';

// Context
const AuthContext = createContext();
const LanguageContext = createContext();

// API Configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
axios.defaults.baseURL = API_BASE_URL;

// Custom Hooks
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('nubix_token'));

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Token is invalid, remove it
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('nubix_token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (fullName, email, password, phoneNumber) => {
    try {
      const response = await axios.post('/api/auth/register', {
        fullName,
        email,
        password,
        phoneNumber
      });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('nubix_token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const phoneAuth = async (phoneNumber) => {
    try {
      const response = await axios.post('/api/auth/phone/send-otp', { phoneNumber });
      return { 
        success: true, 
        verificationId: response.data.verificationId,
        developmentOtp: response.data.developmentOtp 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Phone authentication failed' 
      };
    }
  };

  const verifyOtp = async (phoneNumber, otp) => {
    try {
      const response = await axios.post('/api/auth/phone/verify-otp', {
        phoneNumber,
        otp
      });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('nubix_token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'OTP verification failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nubix_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    register,
    phoneAuth,
    verifyOtp,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Language Provider
const LanguageProvider = ({ children }) => {
  // English-only implementation
  const value = {
    language: 'en',
    isArabic: false,
    isEnglish: true,
    toggleLanguage: () => {}, // No-op since English only
    setEnglish: () => {},
    setArabic: () => {},
    isFirstTime: !localStorage.getItem('nubix_onboarded'),
    completeOnboarding: () => {
      localStorage.setItem('nubix_onboarded', 'true');
    },
    t: (enText) => enText // Always return English text
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <SplashScreen />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <SplashScreen />;
  }
  
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

// Main App Component
function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

// App Routes
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isFirstTime } = useLanguage();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/home" replace /> :
        isFirstTime ? <Navigate to="/onboarding" replace /> :
        <Navigate to="/login" replace />
      } />
      
      <Route path="/onboarding" element={
        <PublicRoute>
          <OnboardingScreen />
        </PublicRoute>
      } />
      
      <Route path="/login" element={
        <PublicRoute>
          <LoginScreen />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <RegisterScreen />
        </PublicRoute>
      } />
      
      <Route path="/phone-auth" element={
        <PublicRoute>
          <PhoneAuthScreen />
        </PublicRoute>
      } />
      
      <Route path="/otp-verification" element={
        <PublicRoute>
          <OtpVerificationScreen />
        </PublicRoute>
      } />
      
      <Route path="/home" element={
        <ProtectedRoute>
          <HomeScreen />
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;