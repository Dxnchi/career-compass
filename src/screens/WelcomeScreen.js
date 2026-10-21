import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Compass, ArrowRight, UserPlus, LogIn } from 'lucide-react-native';

export default function WelcomeScreen({ user, onGetStarted, onOpenAuth, onOpenTerms }) {
  const isAuthenticated = Boolean(user?.name);
  const firstName = isAuthenticated ? user.name.split(' ')[0] : null;

  return (
    <View style={styles.container}>
      <View style={styles.heroBox}>
        <View style={styles.logoBadge}>
          <Compass color="#3b82f6" size={54} />
        </View>
        <Text style={styles.title}>Welcome to Career Compass</Text>
        <Text style={styles.subtitle}>
          {isAuthenticated
            ? `Hi ${firstName}, ready to continue planning your higher education pathway?`
            : 'Scan your matric report card and discover South African university and bursary matches.'}
        </Text>
      </View>

      <View style={styles.actionBox}>
        {isAuthenticated ? (
          <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted}>
            <Text style={styles.primaryButtonText}>Continue to Home</Text>
            <ArrowRight color="#ffffff" size={18} />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={onOpenAuth}>
              <UserPlus color="#ffffff" size={18} />
              <Text style={styles.primaryButtonText}>Get Started / Register</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onOpenAuth}>
              <LogIn color="#60a5fa" size={18} />
              <Text style={styles.secondaryButtonText}>Sign In to Account</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={onOpenTerms}>
          <Text style={styles.termsText}>
            Protected under POPIA • Terms & Conditions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'space-between',
    padding: 24,
  },
  heroBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#f4f4f5',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#a1a1aa',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    maxWidth: 290,
  },
  actionBox: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#27272a',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '600',
  },
  termsText: {
    color: '#71717a',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
});
