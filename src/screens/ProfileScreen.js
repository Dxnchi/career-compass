import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Settings, History } from 'lucide-react-native';

export default function ProfileScreen({
  user = {},
  currentAps = 0,
  onNavigateSettings = () => {},
  onNavigate = () => {},
}) {
  const settingsAction = onNavigateSettings || (() => onNavigate('settings'));

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
          <View style={[styles.avatarImg, { backgroundColor: '#1e3a8a' }]} />
        )}
        <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
        <Text style={styles.userGrade}>{user?.grade || 'Grade 11/12'}</Text>
        <Text style={styles.userSchool}>{user?.school || 'Secondary School'}</Text>
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
          <Text style={styles.statVal}>2026</Text>
          <Text style={styles.statLabel}>Matric Year</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Archived Scans</Text>
      <View style={styles.scanItem}>
        <History color="#60a5fa" size={20} />
        <View style={{ flex: 1 }}>
          <Text style={styles.scanTitle}>Term 2 Grade 11 Report</Text>
          <Text style={styles.scanDate}>Verified via Camera OCR</Text>
        </View>
        <Text style={styles.scanAps}>{currentAps} APS</Text>
      </View>
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
  userName: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  userGrade: { color: '#60a5fa', fontSize: 13, marginTop: 2 },
  userSchool: { color: '#71717a', fontSize: 12, marginTop: 2 },
  statGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statItem: { flex: 1, backgroundColor: '#141416', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#27272a' },
  statVal: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#71717a', fontSize: 11, marginTop: 4 },
  sectionTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  scanItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#141416', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#27272a' },
  scanTitle: { color: '#f4f4f5', fontSize: 14, fontWeight: '600' },
  scanDate: { color: '#71717a', fontSize: 11 },
  scanAps: { color: '#34d399', fontWeight: 'bold', fontSize: 14 },
});
