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
} from 'react-native';
import { ArrowLeft, Shield, LogOut, Check } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

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
      // 1. Persist directly to Supabase profiles table
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

      // 2. Update local state across screens in App.js
      saveAction(updatedUser);
      Alert.alert('Success', 'Profile settings updated successfully.');
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft color="#60a5fa" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <Text style={styles.groupHeader}>Account Information</Text>
      <View style={styles.box}>
        <Text style={styles.inputLabel}>Student Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          placeholderTextColor="#71717a"
        />

        <Text style={styles.inputLabel}>High School</Text>
        <TextInput
          style={styles.input}
          value={school}
          onChangeText={setSchool}
          placeholder="High School"
          placeholderTextColor="#71717a"
        />

        <Text style={styles.inputLabel}>Current Grade</Text>
        <View style={styles.gradeRow}>
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

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <View style={styles.saveBtnContent}>
              <Check color="#ffffff" size={16} />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.groupHeader}>Legal & Data Privacy</Text>
      <View style={styles.box}>
        <View style={styles.infoRow}>
          <Shield color="#3b82f6" size={20} />
          <Text style={styles.infoText}>
            POPIA Act compliant. Your matric marks and personal details are encrypted and used solely for university eligibility calculation.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
        <LogOut color="#ef4444" size={18} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  headerTitle: { color: '#f4f4f5', fontSize: 20, fontWeight: 'bold' },
  groupHeader: { color: '#71717a', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, marginTop: 12 },
  box: { backgroundColor: '#141416', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#27272a', gap: 8 },
  inputLabel: { color: '#a1a1aa', fontSize: 12, marginTop: 2 },
  input: { backgroundColor: '#27272a', color: '#ffffff', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 6 },
  gradeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  gradePill: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: '#27272a', alignItems: 'center' },
  gradePillActive: { backgroundColor: '#1e3a8a', borderWidth: 1, borderColor: '#3b82f6' },
  gradeText: { color: '#a1a1aa', fontSize: 12, fontWeight: '600' },
  gradeTextActive: { color: '#ffffff' },
  saveBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  saveBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  infoRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  infoText: { color: '#a1a1aa', fontSize: 12, flex: 1, lineHeight: 18 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 14, backgroundColor: '#2d1214', borderRadius: 12, marginTop: 24, borderWidth: 1, borderColor: '#7f1d1d' },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 13 },
});
