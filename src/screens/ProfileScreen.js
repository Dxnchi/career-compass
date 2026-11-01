// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Settings, History, Camera, Mail, ShieldCheck, Eye, EyeOff } from 'lucide-react-native';

export default function ProfileScreen({
  user = {},
  currentAps = 0,
  onNavigateSettings = () => {},
  onNavigate = () => {},
}) {
  const [showFullId, setShowFullId] = useState(false);
  const settingsAction = onNavigateSettings || (() => onNavigate('settings'));

  const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return 'S';
    const trimmed = fullName.trim();
    if (!trimmed) return 'S';
    const names = trimmed.split(' ').filter(Boolean);
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  };

  const getMatricYear = (gradeStr) => {
    const currentYear = new Date().getFullYear();
    const clean = (typeof gradeStr === 'string' ? gradeStr : '').toLowerCase();
    if (clean.includes('10')) return currentYear + 2;
    if (clean.includes('11')) return currentYear + 1;
    return currentYear;
  };

  const formatIdNumber = (idStr) => {
    const raw = String(idStr || '').replace(/\s+/g, '');
    if (raw.length !== 13) return 'Unverified ID';
    if (showFullId) {
      return `${raw.slice(0, 6)} ${raw.slice(6, 10)} ${raw.slice(10, 12)} ${raw.slice(12)}`;
    }
    return `${raw.slice(0, 6)} •••• ${raw.slice(10, 12)} •`;
  };

  const hasValidId = String(user?.idNumber || user?.id_number || '').replace(/\s+/g, '').length === 13;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learner Profile</Text>
        <TouchableOpacity style={styles.gearBtn} onPress={settingsAction}>
          <Settings color="#a1a1aa" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarCard}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>
        )}
        <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
        <Text style={styles.userGrade}>{user?.grade || 'Grade 12'}</Text>
        <Text style={styles.userSchool}>{user?.school || 'Secondary School'}</Text>

        {user?.email && (
          <View style={styles.emailRow}>
            <Mail color="#71717a" size={12} />
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
        )}

        {/* Verified SA ID Badge */}
        {hasValidId && (
          <TouchableOpacity
            style={styles.idBadge}
            activeOpacity={0.8}
            onPress={() => setShowFullId(!showFullId)}
          >
            <ShieldCheck color="#34d399" size={14} />
            <Text style={styles.idBadgeText}>
              SA ID: {formatIdNumber(user?.idNumber || user?.id_number)}
            </Text>
            {showFullId ? (
              <EyeOff color="#71717a" size={13} />
            ) : (
              <Eye color="#71717a" size={13} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>{currentAps}</Text>
          <Text style={styles.statLabel}>APS Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>NSC</Text>
          <Text style={styles.statLabel}>Curriculum</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>{getMatricYear(user?.grade)}</Text>
          <Text style={styles.statLabel}>Matric Year</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Archived Scans</Text>
        <TouchableOpacity onPress={() => onNavigate('scan')} style={styles.newScanBtn}>
          <Camera color="#60a5fa" size={14} />
          <Text style={styles.newScanText}>New Scan</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.scanItem}
        onPress={() => onNavigate('confirm_grades')}
      >
        <History color="#60a5fa" size={20} />
        <View style={{ flex: 1 }}>
          <Text style={styles.scanTitle}>Latest NSC Statement / Report</Text>
          <Text style={styles.scanDate}>Tap to review and adjust marks</Text>
        </View>
        <Text style={styles.scanAps}>{currentAps} APS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { color: '#f4f4f5', fontSize: 20, fontWeight: 'bold' },
  gearBtn: { padding: 8, backgroundColor: '#141416', borderRadius: 20 },
  avatarCard: { backgroundColor: '#141416', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#27272a', marginBottom: 16 },
  avatarImg: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  avatarFallback: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1e3a8a', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: '#3b82f6' },
  avatarText: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  userName: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  userGrade: { color: '#60a5fa', fontSize: 13, marginTop: 2 },
  userSchool: { color: '#71717a', fontSize: 12, marginTop: 2 },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  emailText: { color: '#71717a', fontSize: 11 },
  idBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#064e3b', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: '#047857' },
  idBadgeText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  statGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statItem: { flex: 1, backgroundColor: '#141416', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#27272a' },
  statVal: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#71717a', fontSize: 11, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  newScanBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#1e293b', borderRadius: 8 },
  newScanText: { color: '#60a5fa', fontSize: 12, fontWeight: '600' },
  scanItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#141416', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#27272a' },
  scanTitle: { color: '#f4f4f5', fontSize: 14, fontWeight: '600' },
  scanDate: { color: '#71717a', fontSize: 11, marginTop: 2 },
  scanAps: { color: '#34d399', fontWeight: 'bold', fontSize: 14 },
});
