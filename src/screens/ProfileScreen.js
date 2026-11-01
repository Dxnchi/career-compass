import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Settings, ChevronRight, FileText, Trash2, Calendar, Award } from 'lucide-react-native';
import { fetchUserScans, deleteScan } from '../lib/scanStore';
import AnimatedPressable from '../components/AnimatedPressable';

export default function ProfileScreen({
  user = {},
  currentAps = 0,
  onNavigateSettings = () => {},
  onNavigate = () => {},
}) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    setLoading(true);
    const history = await fetchUserScans();
    setScans(history);
    setLoading(false);
  };

  const handleDeleteScan = (scanId) => {
    Alert.alert(
      "Delete Scan Record",
      "Are you sure you want to permanently delete this scan? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteScan(scanId);
              setScans((prevScans) => prevScans.filter((scan) => scan.id !== scanId));
            } catch (error) {
              Alert.alert("Error", "Could not delete the scan. Please try again.");
            }
          } 
        }
      ]
    );
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={onNavigateSettings}>
          <Settings color="#a1a1aa" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user?.name ? user.name.charAt(0).toUpperCase() : 'S'}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          <Text style={styles.userDetails}>{user?.grade || 'Grade 12'} • {user?.school || 'Secondary School'}</Text>
        </View>
      </View>

      <View style={styles.apsCard}>
        <View style={styles.apsLeft}>
          <Award color="#3b82f6" size={24} />
          <View style={styles.apsTextWrap}>
            <Text style={styles.apsLabel}>Active APS Score</Text>
            <Text style={styles.apsSub}>Used for your current degree matches</Text>
          </View>
        </View>
        <Text style={styles.apsValue}>{currentAps > 0 ? currentAps : '--'}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Scan History</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading your past scans...</Text>
        </View>
      ) : scans.length === 0 ? (
        <View style={styles.emptyBox}>
          <FileText color="#71717a" size={32} />
          <Text style={styles.emptyTitle}>No scans yet</Text>
          <Text style={styles.emptySub}>Your report card scans will appear here.</Text>
          <AnimatedPressable style={styles.scanActionBtn} onPress={() => onNavigate('scan')}>
            <Text style={styles.scanActionText}>Scan Now</Text>
          </AnimatedPressable>
        </View>
      ) : (
        <View style={styles.scanList}>
          {scans.map((scan) => {
            const storedAps = Array.isArray(scan.grades) 
              ? scan.grades.reduce((sum, subj) => sum + (subj.level || 0), 0) 
              : 0;

            return (
              <View key={scan.id} style={styles.scanCard}>
                <View style={styles.scanIconWrap}>
                  <FileText color="#60a5fa" size={20} />
                </View>
                <View style={styles.scanInfo}>
                  <Text style={styles.scanTitle}>Report Card Scan</Text>
                  <View style={styles.scanMeta}>
                    <Calendar color="#71717a" size={12} />
                    <Text style={styles.scanDate}>{formatDate(scan.created_at)}</Text>
                  </View>
                  <Text style={styles.scanAps}>Calculated APS: <Text style={styles.scanApsHighlight}>{storedAps}</Text></Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.deleteBtn} 
                  onPress={() => handleDeleteScan(scan.id)}
                >
                  <Trash2 color="#f87171" size={18} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: '#0a0a0a', flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 8 },
  headerTitle: { color: '#f4f4f5', fontSize: 24, fontWeight: 'bold' },
  settingsBtn: { backgroundColor: '#141416', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#27272a' },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141416', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#27272a', marginBottom: 16 },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1e3a8a', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  userDetails: { color: '#a1a1aa', fontSize: 13, marginTop: 2 },
  apsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#141416', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#27272a', marginBottom: 24 },
  apsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  apsTextWrap: { gap: 2 },
  apsLabel: { color: '#f4f4f5', fontSize: 14, fontWeight: '600' },
  apsSub: { color: '#71717a', fontSize: 11 },
  apsValue: { color: '#60a5fa', fontSize: 24, fontWeight: 'bold' },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  scanList: { gap: 12 },
  scanCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141416', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#27272a' },
  scanIconWrap: { backgroundColor: '#1e293b', padding: 12, borderRadius: 12, marginRight: 12 },
  scanInfo: { flex: 1, gap: 4 },
  scanTitle: { color: '#f4f4f5', fontSize: 15, fontWeight: '600' },
  scanMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  scanDate: { color: '#a1a1aa', fontSize: 12 },
  scanAps: { color: '#71717a', fontSize: 12, marginTop: 2 },
  scanApsHighlight: { color: '#f4f4f5', fontWeight: 'bold' },
  deleteBtn: { padding: 10, backgroundColor: '#2a1215', borderRadius: 12, borderWidth: 1, borderColor: '#451a03' },
  loadingBox: { padding: 40, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#a1a1aa', fontSize: 13 },
  emptyBox: { backgroundColor: '#141416', borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#27272a', gap: 10 },
  emptyTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  emptySub: { color: '#a1a1aa', fontSize: 12, textAlign: 'center' },
  scanActionBtn: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 8 },
  scanActionText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
});
