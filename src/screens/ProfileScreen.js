// src/screens/ProfileScreen.js
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Settings, History, Camera, Mail } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

export default function ProfileScreen({
  user = {},
  currentAps = 0,
  onNavigateSettings = () => {},
  onNavigate = () => {},
}) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={settingsAction}>
            <Settings color={COLORS.textDark} size={22} />
          </TouchableOpacity>
        </View>

        {/* User Card (Prototype 10 style) */}
        <View style={styles.userInfo}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </View>
          )}
          <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
          <Text style={styles.userGrade}>{user?.grade || 'Grade 12'}</Text>
          
          {user?.school && (
            <Text style={styles.userSchool}>{user.school}</Text>
          )}
          {user?.email && (
            <View style={styles.emailRow}>
              <Mail color={COLORS.textGray} size={14} />
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
          )}
        </View>

        {/* Stats Row (APS, Curriculum, Matric Year) */}
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

        {/* Archived Scans Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Archived Scans</Text>
          <TouchableOpacity onPress={() => onNavigate('scan')} style={styles.newScanBtn}>
            <Camera color={COLORS.primary} size={14} />
            <Text style={styles.newScanText}>New Scan</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.scanItem}
          onPress={() => onNavigate('confirm_grades')}
        >
          <View style={styles.scanIconBg}>
            <History color={COLORS.primary} size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scanTitle}>Latest NSC Statement</Text>
            <Text style={styles.scanDate}>Tap to review and adjust marks</Text>
          </View>
          <Text style={styles.scanAps}>{currentAps} APS</Text>
        </TouchableOpacity>

        {/* Menu Links (From Prototype 10) */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('matches')}>
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={22} color={COLORS.textDark} />
              <Text style={styles.menuText}>My Grades & Matches</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={settingsAction}>
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={22} color={COLORS.textDark} />
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.textDark} />
              <Text style={styles.menuText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="information-circle-outline" size={22} color={COLORS.textDark} />
              <Text style={styles.menuText}>About</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
          </TouchableOpacity>
        </View>

        {/* Offline Access Card */}
        <View style={styles.offlineCard}>
          <View style={styles.offlineIconBg}>
            <Ionicons name="cloud-offline" size={24} color={COLORS.successText} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.offlineTitle}>Offline Access</Text>
            <Text style={styles.offlineText}>
              All your saved results, university rules and career profiles are stored locally.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingTop: 20, marginBottom: 20
  },
  headerTitle: { fontSize: SIZES.h2, fontWeight: '800', color: COLORS.textDark },
  iconBtn: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.light
  },

  // User Section
  userInfo: { alignItems: 'center', marginBottom: 24 },
  avatarImg: { width: 90, height: 90, borderRadius: 45, marginBottom: 12, borderWidth: 3, borderColor: COLORS.white, ...SHADOWS.light },
  avatarContainer: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#F0EBFF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    borderWidth: 3, borderColor: COLORS.white, ...SHADOWS.light
  },
  avatarText: { color: COLORS.primary, fontSize: 28, fontWeight: '800' },
  userName: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  userGrade: { fontSize: 14, color: COLORS.textGray, fontWeight: '600' },
  userSchool: { fontSize: 12, color: COLORS.textGray, marginTop: 4 },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  emailText: { color: COLORS.textGray, fontSize: 12 },

  // Stats Grid
  statGrid: { flexDirection: 'row', gap: 10, marginHorizontal: SIZES.padding, marginBottom: 24 },
  statItem: { 
    flex: 1, backgroundColor: COLORS.white, padding: 16, borderRadius: SIZES.radius, 
    alignItems: 'center', ...SHADOWS.light 
  },
  statVal: { color: COLORS.primary, fontSize: 20, fontWeight: '800' },
  statLabel: { color: COLORS.textGray, fontSize: 11, marginTop: 4, fontWeight: '600' },

  // Archived Scans
  sectionHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: SIZES.padding, marginBottom: 12 
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  newScanBtn: { 
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, 
    paddingHorizontal: 12, backgroundColor: '#F0EBFF', borderRadius: 20 
  },
  newScanText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  
  scanItem: { 
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.white, 
    marginHorizontal: SIZES.padding, padding: 16, borderRadius: SIZES.radius, 
    marginBottom: 24, ...SHADOWS.light 
  },
  scanIconBg: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0EBFF',
    justifyContent: 'center', alignItems: 'center'
  },
  scanTitle: { color: COLORS.textDark, fontSize: 14, fontWeight: '700' },
  scanDate: { color: COLORS.textGray, fontSize: 11, marginTop: 2 },
  scanAps: { color: COLORS.successText, fontWeight: '800', fontSize: 14 },

  // Menu Container
  menuContainer: {
    backgroundColor: COLORS.white, marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius, paddingHorizontal: 16, marginBottom: 24, ...SHADOWS.light
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 15, fontWeight: '600', color: COLORS.textDark },

  // Offline Card
  offlineCard: {
    flexDirection: 'row', backgroundColor: COLORS.successBg,
    marginHorizontal: SIZES.padding, padding: 16, borderRadius: SIZES.radius,
    alignItems: 'center', marginBottom: 30
  },
  offlineIconBg: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center'
  },
  offlineTitle: { fontSize: 15, fontWeight: '700', color: COLORS.successText, marginBottom: 4 },
  offlineText: { fontSize: 12, color: COLORS.successText, lineHeight: 18, opacity: 0.9 }
});