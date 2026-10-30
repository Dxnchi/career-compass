import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ArrowLeft, Shield, LogOut, Check, User, School, GraduationCap } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

export default function SettingsScreen({
  user = {},
  onBack = () => {},
  onSaveUser,
  onUpdateUser,
  onLogout = () => {},
}) {
  const [name, setName] = useState(user?.name || '');
  const [school, setSchool] = useState(user?.school || '');
  const [grade, setGrade] = useState(user?.grade || 'Grade 12');
  const [saving, setSaving] = useState(false);

  const saveAction = onSaveUser || onUpdateUser || (() => {});

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }

    setSaving(true);
    const updatedUser = {
      ...user,
      name: name.trim(),
      school: school.trim(),
      grade,
    };

    try {
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: name.trim(),
            school: school.trim(),
            grade,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) {
          console.warn('Supabase profile update warning:', error.message);
        }
      }

      saveAction(updatedUser);
      Alert.alert('Success 🎉', 'Profile settings updated successfully.');
    } catch (err) {
      console.error('Settings save error:', err);
      Alert.alert('Error', 'Failed to save settings. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: onLogout },
      ]
    );
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
              <ArrowLeft color={COLORS.textDark} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings </Text>
            <View style={{ width: 44 }} /> {/* Spacer */}
          </View>

          <Text style={styles.subtitle}>Update your academic profile details below.</Text>

          {/* Account Info Card */}
          <View style={styles.card}>
            
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <View style={[styles.iconBox, { backgroundColor: '#E8E0FF' }]}>
                <User color={COLORS.primary} size={20} />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.textGray}
                />
              </View>
            </View>

            {/* School Input */}
            <View style={styles.inputGroup}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                <School color="#FF9800" size={20} />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>High School</Text>
                <TextInput
                  style={styles.input}
                  value={school}
                  onChangeText={setSchool}
                  placeholder="Enter your school"
                  placeholderTextColor={COLORS.textGray}
                />
              </View>
            </View>

            {/* Grade Selector */}
            <View style={styles.inputGroup}>
              <View style={[styles.iconBox, { backgroundColor: '#D1F4FF' }]}>
                <GraduationCap color="#00A86B" size={20} />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Current Grade</Text>
                <View style={styles.gradeRow}>
                  {['Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.gradePill, grade === g && styles.gradePillActive]}
                      onPress={() => setGrade(g)}
                    >
                      <Text style={[styles.gradeText, grade === g && styles.gradeTextActive]}>
                        {g.replace('Grade ', '')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <View style={styles.saveBtnContent}>
                  <Check color={COLORS.white} size={20} />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Privacy Card */}
          <View style={styles.privacyCard}>
            <View style={styles.privacyIconBg}>
              <Shield color={COLORS.successText} size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyTitle}>Safe & Secure</Text>
              <Text style={styles.privacyText}>
                POPIA Act compliant. Your matric marks and personal details are encrypted and used solely for university eligibility calculation.
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
            <LogOut color={COLORS.white} size={20} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, overflow: 'hidden' },
  
  // Fun Background Shapes
  shape: { position: 'absolute', borderRadius: 1000, opacity: 0.6 },
  shapePurple: { width: 250, height: 250, backgroundColor: '#E8E0FF', top: -80, right: -80 },
  shapeYellow: { width: 120, height: 120, backgroundColor: '#FFF3E0', top: 200, left: -40 },
  shapeCyan: { width: 180, height: 180, backgroundColor: '#D1F4FF', bottom: 100, right: -50 },

  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding, paddingTop: 20, paddingBottom: 10
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.light
  },
  headerTitle: { fontSize: SIZES.h2, fontWeight: '800', color: COLORS.textDark },
  subtitle: { 
    fontSize: 14, color: COLORS.textGray, fontWeight: '500',
    paddingHorizontal: SIZES.padding, marginTop: 10, marginBottom: 24 
  },

  // Card Container
  card: {
    backgroundColor: COLORS.white, marginHorizontal: SIZES.padding,
    padding: 20, borderRadius: 24, ...SHADOWS.light, marginBottom: 20
  },
  
  // Fun Input Groups
  inputGroup: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  iconBox: {
    width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 6
  },
  inputWrapper: { flex: 1 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textGray, marginBottom: 6, marginLeft: 4 },
  input: { 
    backgroundColor: '#F8F9FA', color: COLORS.textDark, 
    paddingHorizontal: 16, height: 50, borderRadius: 12, fontSize: 15,
    borderWidth: 1, borderColor: COLORS.border
  },

  // Grade Selector
  gradeRow: { flexDirection: 'row', gap: 8 },
  gradePill: { 
    flex: 1, paddingVertical: 12, borderRadius: 12, 
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: COLORS.border, 
    alignItems: 'center' 
  },
  gradePillActive: { backgroundColor: '#E8E0FF', borderColor: COLORS.primary },
  gradeText: { color: COLORS.textGray, fontSize: 14, fontWeight: '700' },
  gradeTextActive: { color: COLORS.primary },

  // Save Button
  saveBtn: { 
    backgroundColor: COLORS.primary, height: 56, borderRadius: 16, 
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6
  },
  saveBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },

  // Privacy Card
  privacyCard: {
    flexDirection: 'row', backgroundColor: COLORS.successBg,
    marginHorizontal: SIZES.padding, padding: 20, borderRadius: 24,
    alignItems: 'flex-start', marginBottom: 30
  },
  privacyIconBg: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
    ...SHADOWS.light
  },
  privacyTitle: { fontSize: 15, fontWeight: '800', color: COLORS.successText, marginBottom: 4 },
  privacyText: { color: COLORS.successText, fontSize: 12, lineHeight: 18, fontWeight: '500' },

  // Logout Button (Chunky Red)
  logoutBtn: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, 
    backgroundColor: '#FF3B30', paddingVertical: 18, marginHorizontal: SIZES.padding,
    borderRadius: 20,
    shadowColor: '#FF3B30', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6
  },
  logoutText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
});