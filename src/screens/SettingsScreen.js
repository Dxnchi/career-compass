import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { ArrowLeft, Shield, LogOut, Check, ShieldCheck, Users } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export default function SettingsScreen({
  user = {},
  onBack = () => {},
  onSaveUser,
  onUpdateUser,
  onLogout = () => {},
  onNavigate = () => {},
}) {
  const [name, setName] = useState(user?.name || '');
  const [school, setSchool] = useState(user?.school || '');
  const [grade, setGrade] = useState(user?.grade || 'Grade 12');
  const [saving, setSaving] = useState(false);

  const saveAction = onSaveUser || onUpdateUser || (() => {});

  const notify = (title, msg) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      notify('Required', 'Please enter your full name.');
      return;
    }

    setSaving(true);
    const updatedUser = { ...user, name: name.trim(), school: school.trim(), grade };

    try {
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: name.trim(),
            school: school.trim(),
            grade,
          })
          .eq('id', user.id);

        if (error) console.warn('Supabase update warning:', error.message);
      }

      saveAction(updatedUser);
      notify('Success', 'Profile settings updated.');
    } catch (err) {
      notify('Error', 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutPress = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out?')) {
        onLogout();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: onLogout },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft color="#60a5fa" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {user?.role === 'admin' && (
        <View style={{ marginBottom: 14 }}>
          <Text style={styles.groupHeader}>Administrator Controls</Text>
          <TouchableOpacity style={styles.adminCard} onPress={() => onNavigate('admin_users')}>
            <View style={styles.adminCardHeader}>
              <View style={styles.adminIconWrap}>
                <Users color="#60a5fa" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.adminBadgeRow}>
                  <Text style={styles.adminCardTitle}>User Activity & Sessions</Text>
                  <View style={styles.roleBadge}>
                    <ShieldCheck color="#34d399" size={12} />
                    <Text style={styles.roleBadgeText}>Admin</Text>
                  </View>
                </View>
                <Text style={styles.adminCardSub}>View active connected students and login telemetry.</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.groupHeader}>Account Information</Text>
      <View style={styles.box}>
        <Text style={styles.inputLabel}>Student Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" placeholderTextColor="#71717a" />

        <Text style={styles.inputLabel}>High School</Text>
        <TextInput style={styles.input} value={school} onChangeText={setSchool} placeholder="High School" placeholderTextColor="#71717a" />

        <Text style={styles.inputLabel}>Current Grade</Text>
        <View style={styles.gradeRow}>
          {['Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
            <TouchableOpacity key={g} style={[styles.gradePill, grade === g && styles.gradePillActive]} onPress={() => setGrade(g)}>
              <Text style={[styles.gradeText, grade === g && styles.gradeTextActive]}>{g}</Text>
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
          <Text style={styles.infoText}>POPIA Act compliant. Transcript data and marks are processed securely.</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOutPress}>
        <LogOut color="#ef4444" size={18} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  headerTitle: { color: '#f4f4f5', fontSize: 20, fontWeight: 'bold' },
  groupHeader: { color: '#71717a', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, marginTop: 14 },
  adminCard: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1e3a8a', padding: 16, borderRadius: 14 },
  adminCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  adminIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  adminBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  adminCardTitle: { color: '#f4f4f5', fontSize: 14, fontWeight: 'bold' },
  adminCardSub: { color: '#93c5fd', fontSize: 11, marginTop: 2 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#064e3b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  roleBadgeText: { color: '#34d399', fontSize: 10, fontWeight: 'bold' },
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
