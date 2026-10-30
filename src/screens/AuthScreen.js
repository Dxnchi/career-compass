import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Compass, User, Mail, Lock, School } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

export default function AuthScreen({ onAuthSuccess, onCancel }) {
  const [isRegistering, setIsRegistering] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('Grade 11');
  const [password, setPassword] = useState('');

  const showError = (msg) => {
    setErrorMessage(msg);
    if (Platform.OS !== 'web') {
      Alert.alert('Notice', msg);
    }
  };

  const handleAuth = async () => {
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      showError('Please enter both your email and password.');
      return;
    }

    if (cleanPassword.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        const cleanName = name.trim();
        const cleanSchool = school.trim();

        if (!cleanName || !cleanSchool) {
          showError('Please enter your full name and high school.');
          setLoading(false);
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName,
              school: cleanSchool,
              grade: grade,
            },
          },
        });

        if (authError) throw authError;

        if (!authData?.user) {
          throw new Error('No user returned from Supabase. Please check your credentials.');
        }

        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            name: cleanName,
            school: cleanSchool,
            grade: grade,
            updated_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          console.warn('Profile table upsert notice:', profileError.message);
        }

        if (!authData.session) {
          Alert.alert(
            'Account Created',
            'Registration successful! If you have email confirmation enabled, check your inbox before logging in.'
          );
        }

        onAuthSuccess({
          id: authData.user.id,
          name: cleanName,
          email: cleanEmail,
          school: cleanSchool,
          grade: grade,
        });
      } else {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (authError) throw authError;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const metadata = authData.user.user_metadata || {};

        onAuthSuccess({
          id: authData.user.id,
          name: profile?.name || metadata.full_name || cleanEmail.split('@')[0],
          email: cleanEmail,
          school: profile?.school || metadata.school || 'Secondary School',
          grade: profile?.grade || metadata.grade || 'Grade 12',
        });
      }
    } catch (err) {
      console.error('Supabase Auth Error:', err);
      showError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Fun Background Shapes */}
      <View style={[styles.shape, styles.shapePurple]} />
      <View style={[styles.shape, styles.shapeYellow]} />
      <View style={[styles.shape, styles.shapeCyan]} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {onCancel && (
            <TouchableOpacity style={styles.backBtn} onPress={onCancel}>
              <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          )}

          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Compass color={COLORS.white} size={32} />
            </View>
            <Text style={styles.title}>
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.subtitle}>
              {isRegistering
                ? 'Set up your profile to track APS and degree matches.'
                : 'Sign in to access your saved matches.'}
            </Text>
          </View>

          {errorMessage !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.form}>
            {isRegistering && (
              <>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrap}>
                  <User color={COLORS.textGray} size={18} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Sipho Ndlovu"
                    placeholderTextColor={COLORS.textGray}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <Text style={styles.label}>High School</Text>
                <View style={styles.inputWrap}>
                  <School color={COLORS.textGray} size={18} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Parktown Boys' High"
                    placeholderTextColor={COLORS.textGray}
                    value={school}
                    onChangeText={setSchool}
                  />
                </View>

                <Text style={styles.label}>Current Grade</Text>
                <View style={styles.gradeSelector}>
                  {['Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.gradePill, grade === g && styles.gradePillActive]}
                      onPress={() => setGrade(g)}
                    >
                      <Text style={[styles.gradeText, grade === g && styles.gradeTextActive]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrap}>
              <Mail color={COLORS.textGray} size={18} />
              <TextInput
                style={styles.input}
                placeholder="student@example.co.za"
                placeholderTextColor={COLORS.textGray}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Lock color={COLORS.textGray} size={18} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textGray}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isRegistering ? 'Register & Continue' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleBtn}
              onPress={() => {
                setErrorMessage('');
                setIsRegistering(!isRegistering);
              }}
            >
              <Text style={styles.toggleText}>
                {isRegistering
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, overflow: 'hidden' },
  
  // Fun Background Shapes
  shape: { position: 'absolute', borderRadius: 1000, opacity: 0.9 },
  shapePurple: { width: 350, height: 350, backgroundColor: COLORS.primary, top: -150, right: -100 },
  shapeYellow: { width: 120, height: 120, backgroundColor: COLORS.accentYellow, bottom: 150, left: -40 },
  shapeCyan: { width: 200, height: 200, backgroundColor: COLORS.secondary, bottom: -50, right: -50 },

  scrollContent: { flexGrow: 1, padding: SIZES.padding, justifyContent: 'center' },
  
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.light,
    marginBottom: 20, marginTop: 20
  },

  header: { alignItems: 'center', marginBottom: 30 },
  logoBadge: { 
    width: 72, height: 72, borderRadius: 24, backgroundColor: COLORS.primary, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    transform: [{ rotate: '-10deg' }], ...SHADOWS.light
  },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textDark, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textGray, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },

  errorBox: { backgroundColor: '#FFE8E8', padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#FF3B30' },
  errorText: { color: '#FF3B30', fontSize: 13, textAlign: 'center', fontWeight: '600' },

  form: { gap: 12 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginLeft: 4 },
  inputWrap: { 
    flexDirection: 'row', alignItems: 'center', gap: 12, 
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: COLORS.border, 
    borderRadius: SIZES.radius, paddingHorizontal: 16, height: 56 
  },
  input: { flex: 1, color: COLORS.textDark, fontSize: 15 },

  gradeSelector: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  gradePill: { 
    flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#F8F9FA', 
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' 
  },
  gradePillActive: { backgroundColor: '#E8E0FF', borderColor: COLORS.primary },
  gradeText: { color: COLORS.textGray, fontSize: 13, fontWeight: '600' },
  gradeTextActive: { color: COLORS.primary, fontWeight: '800' },

  submitBtn: { 
    backgroundColor: COLORS.primary, height: 56, borderRadius: SIZES.radius, 
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8
  },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },

  toggleBtn: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  toggleText: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
});