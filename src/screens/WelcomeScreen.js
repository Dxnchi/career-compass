import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../components/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ onGetStarted, onOpenAuth }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background Decorative Shapes */}
      {/* Purple top left blob */}
      <View style={[styles.shape, styles.shapePurple]} />
      {/* Yellow top right dot */}
      <View style={[styles.shape, styles.shapeYellow]} />
      {/* Cyan bottom left blob */}
      <View style={[styles.shape, styles.shapeCyan]} />

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIconBg}>
            <Ionicons name="navigate" size={28} color={COLORS.white} />
          </View>
          <Text style={styles.logoText}>Career Compass</Text>
        </View>

        {/* Main Text */}
        <Text style={styles.title}>
          Your grades today.{'\n'}Your future tomorrow.
        </Text>
        <Text style={styles.subtitle}>Scan. Match. Explore.</Text>
      </View>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onOpenAuth} 
          style={styles.loginButton}
          activeOpacity={0.6}
        >
          <Text style={styles.loginText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.white, 
    overflow: 'hidden' // Ensures the background shapes don't spill out
  },
  
  // --- Background Decorative Shapes ---
  shape: { 
    position: 'absolute', 
    borderRadius: 1000 // Makes them perfectly round/blobby
  },
  shapePurple: { 
    width: 400, 
    height: 400, 
    backgroundColor: COLORS.primary, 
    top: -150, 
    left: -100, 
    opacity: 0.9 
  },
  shapeYellow: { 
    width: 140, 
    height: 140, 
    backgroundColor: COLORS.accentYellow, 
    top: 80, 
    right: -20 
  },
  shapeCyan: { 
    width: 250, 
    height: 250, 
    backgroundColor: COLORS.secondary, 
    bottom: -50, 
    left: -100,
    opacity: 0.8 
  },

  // --- Content ---
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: SIZES.padding,
    marginTop: 60 
  },
  logoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 40 
  },
  logoIconBg: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-15deg' }] // Adds that playful angled look
  },
  logoText: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: COLORS.textDark, 
    marginLeft: 12 
  },
  title: { 
    fontSize: 34, 
    fontWeight: '800', 
    color: COLORS.textDark, 
    lineHeight: 42, 
    marginBottom: 16 
  },
  subtitle: { 
    fontSize: SIZES.h3, 
    color: COLORS.textGray, 
    fontWeight: '500' 
  },
  
  // --- Footer ---
  footer: { 
    paddingHorizontal: SIZES.padding, 
    paddingBottom: 40 
  },
  primaryButton: { 
    backgroundColor: COLORS.primary, 
    paddingVertical: 18, 
    borderRadius: SIZES.radius, 
    alignItems: 'center',
    // Custom shadow to make the purple button pop
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8 
  },
  primaryButtonText: { 
    color: COLORS.white, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  loginButton: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  loginText: { 
    color: COLORS.primary, 
    fontSize: 14, 
    fontWeight: '600' 
  }
});