// src/components/theme.js

export const COLORS = {
  primary: '#6C47FF', // Main Purple
  secondary: '#00D4FF', // Bright Cyan
  accentYellow: '#FFC800',
  background: '#F8F9FA', // Light gray app background
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#8E8E93',
  border: '#E5E5EA',
  
  // Status colors for matches
  successBg: '#E6F8F1',
  successText: '#00A86B',
  warningBg: '#FFF3E0',
  warningText: '#FF9800',
};

export const SIZES = {
  h1: 28,
  h2: 22,
  h3: 18,
  body: 14,
  padding: 20,
  radius: 16, // For those nice rounded corners
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  }
};