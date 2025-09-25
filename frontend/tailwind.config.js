/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // NUBIX Brand Colors ONLY - from your logo
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Main gold from logo
          600: '#d97706', // Darker gold from logo
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af', // Main navy from logo
          900: '#1e3a8a', // Darker navy from logo
        },
        // Functional colors using logo palette
        success: '#f59e0b', // Use gold for success
        error: '#dc2626', // Keep red for errors
        warning: '#f59e0b', // Use gold
        // Neutral colors
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'nubix-gradient': 'linear-gradient(135deg, #f59e0b 0%, #1e3a8a 100%)',
        'nubix-gold': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'nubix-navy': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      },
      boxShadow: {
        'nubix': '0 4px 6px -1px rgba(245, 158, 11, 0.1), 0 2px 4px -1px rgba(245, 158, 11, 0.06)',
        'nubix-lg': '0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}