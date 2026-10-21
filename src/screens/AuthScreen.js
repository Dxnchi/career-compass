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
} from 'react-native';
import { Compass, User, Mail, Lock, School } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

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

    if (!email.trim() || !password.trim()) {
      showError('Please enter both your email and password.');
      return;
    }

    if (password.trim().length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        if (!name.trim() || !school.trim()) {
          showError('Please enter your full name and high school.');
          setLoading(false);
          return;
        }

        console.log('Attempting signup for:', email.trim());

        // 1. Sign up the user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (authError) throw authError;

        if (!authData?.user) {
          throw new Error('No user returned from Supabase. Check your connection or keys.');
        }

        console.log('User created:', authData.user.id);

        // 2. Insert into profiles table
        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            name: name.trim(),
            school: school.trim(),
            grade: grade,
          },
        ]);

        if (profileError) {
          console.warn('Profile insert note:', profileError.message);
          // Even if profile table insert has an RLS hiccup, let user in locally
        }

        onAuthSuccess({
          id: authData.user.id,
          name: name.trim(),
          email: email.trim(),
          school: school.trim(),
          grade: grade,
        });
      } else {
        console.log('Attempting sign-in for:', email.trim());

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (authError) throw authError;

        // Fetch user profile from database
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        onAuthSuccess({
          id: authData.user.id,
          name: profile?.name || email.split('@')[0],
          email: email.trim(),
          school: profile?.school || 'Secondary School',
          grade: profile?.grade || 'Grade 12',
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Compass color="#3b82f6" size={40} />
        </View>
        <Text style={styles.title}>
          {isRegistering ? 'Create Student Account' : 'Welcome Back'}
        </Text>
        <Text style={styles.subtitle}>
          {isRegistering
            ? 'Set up your Matric academic profile to track APS and degree matches.'
            : 'Sign in to access your saved matches and scan history.'}
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
              <User color="#71717a" size={18} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Sipho Ndlovu"
                placeholderTextColor="#71717a"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>High School</Text>
            <View style={styles.inputWrap}>
              <School color="#71717a" size={18} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Parktown Boys' High"
                placeholderTextColor="#71717a"
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
          <Mail color="#71717a" size={18} />
          <TextInput
            style={styles.input}
            placeholder="student@example.co.za"
            placeholderTextColor="#71717a"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrap}>
          <Lock color="#71717a" size={18} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#71717a"
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
            <ActivityIndicator color="#ffffff" />
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

        {onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Back to Welcome</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#0a0a0a', flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  logoBadge: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#111827', borderWidth: 2, borderColor: '#1e3a8a', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { color: '#f4f4f5', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#a1a1aa', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  errorBox: { backgroundColor: '#451a1a', borderWidth: 1, borderColor: '#ef4444', padding: 12, borderRadius: 10, marginBottom: 14 },
  errorText: { color: '#fca5a5', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  form: { gap: 10 },
  label: { color: '#d4d4d8', fontSize: 12, fontWeight: '600', marginTop: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#141416', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  input: { flex: 1, color: '#ffffff', fontSize: 14 },
  gradeSelector: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  gradePill: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#141416', borderWidth: 1, borderColor: '#27272a', alignItems: 'center' },
  gradePillActive: { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' },
  gradeText: { color: '#a1a1aa', fontSize: 12, fontWeight: '600' },
  gradeTextActive: { color: '#ffffff' },
  submitBtn: { backgroundColor: '#2563eb', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  toggleBtn: { alignItems: 'center', marginTop: 10, paddingVertical: 6 },
  toggleText: { color: '#60a5fa', fontSize: 13, fontWeight: '600' },
  cancelBtn: { alignItems: 'center', marginTop: 6, paddingVertical: 4 },
  cancelText: { color: '#71717a', fontSize: 12 },
});
