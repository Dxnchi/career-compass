// src/screens/AuthScreen.js
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {
  Mail,
  Lock,
  User,
  School,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { validateSouthAfricanID } from '../utils/saIdValidator';

export default function AuthScreen({ onAuthSuccess = () => {}, onCancel = () => {} }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('Grade 12');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Live validation of the ID number as the student types
  const idValidation = useMemo(() => {
    if (!idNumber) return null;
    return validateSouthAfricanID(idNumber);
  }, [idNumber]);

  const showNotice = (title, message) => {
    setErrorMsg(message);
    if (Platform.OS !== 'web') {
      Alert.alert(title, message);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      showNotice('Missing Fields', 'Please enter both your email and password.');
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        showNotice('Missing Name', 'Please enter your full name.');
        return;
      }

      const idCheck = validateSouthAfricanID(idNumber);
      if (!idCheck.isValid) {
        showNotice('Invalid SA ID Number', idCheck.error);
        return;
      }

      if (!school.trim()) {
        showNotice('Missing School', 'Please enter your high school name.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        // 1. Sign In Existing User
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) throw error;

        if (data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          onAuthSuccess({
            id: data.user.id,
            email: data.user.email,
            name: profile?.name || data.user.user_metadata?.name || 'Student',
            idNumber: profile?.id_number || data.user.user_metadata?.id_number || '',
            school: profile?.school || data.user.user_metadata?.school || 'Secondary School',
            grade: profile?.grade || data.user.user_metadata?.grade || 'Grade 12',
            role: profile?.role || 'student',
          });
        }
      } else {
        // 2. Register New Student
        const cleanId = idNumber.replace(/\s+/g, '');

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: name.trim(),
              id_number: cleanId,
              school: school.trim(),
              grade,
            },
          },
        });

        if (error) throw error;

        if (data?.user) {
          const now = new Date().toISOString();
          
          // CHANGE: Replaced .upsert() with .update()
          // The SQL trigger already created the row with ID, Email, and Role.
          // Now we just fill in the extra metadata.
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              name: name.trim(),
              id_number: cleanId,
              school: school.trim(),
              grade,
              last_sign_in_at: now,
              last_seen_at: now,
            })
            .eq('id', data.user.id); // Ensure we only update this specific user's row

          if (profileError) {
            console.warn('Profile update notice:', profileError.message);
          }

          onAuthSuccess({
            id: data.user.id,
            email: data.user.email,
            name: name.trim(),
            idNumber: cleanId,
            school: school.trim(),
            grade,
            role: 'student',
          });
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.backBtn} onPress={onCancel}>
        <ArrowLeft color="#60a5fa" size={22} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Student Account'}</Text>
      <Text style={styles.subtitle}>
        {isLogin
          ? 'Sign in to access your verified APS and degree matches.'
          : 'Register with your South African ID to verify matric eligibility.'}
      </Text>

      {/* Mode Switcher */}
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[styles.switchTab, isLogin && styles.switchTabActive]}
          onPress={() => {
            setIsLogin(true);
            setErrorMsg('');
          }}
        >
          <Text style={[styles.switchText, isLogin && styles.switchTextActive]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchTab, !isLogin && styles.switchTabActive]}
          onPress={() => {
            setIsLogin(false);
            setErrorMsg('');
          }}
        >
          <Text style={[styles.switchText, !isLogin && styles.switchTextActive]}>Register</Text>
        </TouchableOpacity>
      </View>

      {errorMsg ? (
        <View style={styles.errorBanner}>
          <AlertCircle color="#f87171" size={16} />
          <Text style={styles.errorBannerText}>{errorMsg}</Text>
        </View>
      ) : null}

      <View style={styles.formCard}>
        {!isLogin && (
          <>
            <Text style={styles.label}>Student Full Name (as on ID)</Text>
            <View style={styles.inputWrap}>
              <User color="#71717a" size={18} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Onkarabetse Motale"
                placeholderTextColor="#71717a"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>South African ID Number (13 Digits)</Text>
            <View
              style={[
                styles.inputWrap,
                idNumber.length > 0 &&
                  (idValidation?.isValid ? styles.inputValid : styles.inputInvalid),
              ]}
            >
              <CreditCard color="#71717a" size={18} />
              <TextInput
                style={styles.input}
                placeholder="YYMMDDSSSSCAZ"
                placeholderTextColor="#71717a"
                keyboardType="numeric"
                maxLength={13}
                value={idNumber}
                onChangeText={(val) => setIdNumber(val.replace(/[^0-9]/g, ''))}
              />
              {idNumber.length > 0 &&
                (idValidation?.isValid ? (
                  <CheckCircle2 color="#34d399" size={18} />
                ) : (
                  <AlertCircle color="#f87171" size={18} />
                ))}
            </View>

            {/* Live ID Validation Feedback */}
            {idNumber.length > 0 && (
              <View style={styles.idFeedbackRow}>
                {idValidation?.isValid ? (
                  <Text style={styles.idValidText}>
                    ✓ Valid ID • DOB: {idValidation.dateOfBirth} - {idValidation.citizenship}
                  </Text>
                ) : (
                  <Text style={styles.idInvalidText}>{idValidation?.error}</Text>
                )}
              </View>
            )}

            <Text style={styles.label}>High School</Text>
            <View style={styles.inputWrap}>
              <School color="#71717a" size={18} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Parktown Boys' High School"
                placeholderTextColor="#71717a"
                value={school}
                onChangeText={setSchool}
              />
            </View>

            <Text style={styles.label}>Current Grade</Text>
            <View style={styles.gradeRow}>
              {['Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.gradeChip, grade === g && styles.gradeChipActive]}
                  onPress={() => setGrade(g)}
                >
                  <Text style={[styles.gradeText, grade === g && styles.gradeTextActive]}>{g}</Text>
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
            placeholder="student@email.co.za"
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
            placeholder="Minimum 6 characters"
            placeholderTextColor="#71717a"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitText}>
              {isLogin ? 'Sign In' : 'Verify ID & Create Account'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#0a0a0a', flexGrow: 1, justifyContent: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20, alignSelf: 'flex-start' },
  backText: { color: '#60a5fa', fontSize: 14, fontWeight: '600' },
  title: { color: '#f4f4f5', fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: '#a1a1aa', fontSize: 13, marginTop: 4, marginBottom: 20, lineHeight: 18 },
  switchRow: { flexDirection: 'row', backgroundColor: '#141416', borderRadius: 12, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: '#27272a' },
  switchTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  switchTabActive: { backgroundColor: '#2563eb' },
  switchText: { color: '#71717a', fontWeight: 'bold', fontSize: 13 },
  switchTextActive: { color: '#ffffff' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#2d1214', borderWidth: 1, borderColor: '#7f1d1d', padding: 12, borderRadius: 10, marginBottom: 14 },
  errorBannerText: { color: '#f87171', fontSize: 12, flex: 1 },
  formCard: { backgroundColor: '#141416', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#27272a' },
  label: { color: '#a1a1aa', fontSize: 12, marginBottom: 6, marginTop: 10, fontWeight: '500' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#27272a', paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#3f3f46' },
  inputValid: { borderColor: '#10b981' },
  inputInvalid: { borderColor: '#ef4444' },
  input: { flex: 1, color: '#ffffff', paddingVertical: 11, fontSize: 13 },
  idFeedbackRow: { marginTop: 6, marginBottom: 2 },
  idValidText: { color: '#34d399', fontSize: 11, fontWeight: '600' },
  idInvalidText: { color: '#f87171', fontSize: 11 },
  gradeRow: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 6 },
  gradeChip: { flex: 1, paddingVertical: 9, backgroundColor: '#27272a', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#3f3f46' },
  gradeChipActive: { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' },
  gradeText: { color: '#a1a1aa', fontSize: 12, fontWeight: '600' },
  gradeTextActive: { color: '#ffffff' },
  submitBtn: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 22 },
  submitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});
