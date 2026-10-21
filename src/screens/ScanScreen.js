import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, X, Image as ImageIcon } from 'lucide-react-native';

export default function ScanScreen({ onCancel, onClose, onScanComplete }) {
  const [loading, setLoading] = useState(false);
  const handleExit = onCancel || onClose || (() => {});

  const simulateOCR = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (typeof onScanComplete === 'function') {
        onScanComplete([
          { id: 'math', name: 'Mathematics', category: 'Core Subject', level: 6, percentage: 76 },
          { id: 'eng', name: 'English Home Language', category: 'Language', level: 6, percentage: 74 },
          { id: 'phys', name: 'Physical Sciences', category: 'Elective', level: 5, percentage: 67 },
          { id: 'lo', name: 'Life Orientation', category: 'Core Subject', level: 7, percentage: 88 },
          { id: 'afr', name: 'Afrikaans First Additional', category: 'Language', level: 5, percentage: 65 },
          { id: 'geo', name: 'Geography', category: 'Elective', level: 6, percentage: 75 },
        ]);
      }
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleExit}>
          <X color="#f4f4f5" size={20} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Scan Report Card</Text>
        <View style={styles.offlinePill}>
          <Text style={styles.offlineText}>Offline OCR</Text>
        </View>
      </View>

      <View style={styles.viewfinderContainer}>
        <View style={styles.targetFrame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />

          {loading ? (
            <View style={styles.processingWrap}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.processingText}>Extracting NSC Subjects...</Text>
            </View>
          ) : (
            <View style={styles.placeholderCard}>
              <Text style={styles.mockHeader}>Republic of South Africa</Text>
              <Text style={styles.mockSub}>NSC Assessment - Term 2 Report</Text>
              <View style={styles.mockDivider} />
              <Text style={styles.mockRow}>Mathematics: 76% (Level 6)</Text>
              <Text style={styles.mockRow}>Physical Sciences: 67% (Level 5)</Text>
              <Text style={styles.mockRow}>English Home Lang: 74% (Level 6)</Text>
              <Text style={styles.mockRow}>Geography: 75% (Level 6)</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.captureBtn, loading && styles.captureBtnDisabled]}
          onPress={simulateOCR}
          disabled={loading}
        >
          <Camera color="#ffffff" size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryBtn} onPress={simulateOCR}>
          <ImageIcon color="#60a5fa" size={16} />
          <Text style={styles.galleryText}>Upload from gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', justifyContent: 'space-between', padding: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: { backgroundColor: '#18181b', padding: 8, borderRadius: 20 },
  topTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  offlinePill: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  offlineText: { color: '#60a5fa', fontSize: 11, fontWeight: '600' },
  viewfinderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  targetFrame: { width: 300, height: 380, borderWidth: 1, borderColor: '#27272a', borderRadius: 16, position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#3b82f6' },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  placeholderCard: { padding: 20, alignItems: 'center', width: '85%' },
  mockHeader: { color: '#60a5fa', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  mockSub: { color: '#71717a', fontSize: 10, marginTop: 2 },
  mockDivider: { height: 1, backgroundColor: '#27272a', width: '100%', marginVertical: 12 },
  mockRow: { color: '#d4d4d8', fontSize: 11, marginVertical: 3, fontFamily: 'monospace' },
  processingWrap: { alignItems: 'center', gap: 12 },
  processingText: { color: '#3b82f6', fontWeight: '600', fontSize: 13 },
  bottomBar: { alignItems: 'center', paddingBottom: 20, gap: 12 },
  captureBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  captureBtnDisabled: { backgroundColor: '#1e3a8a' },
  galleryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#18181b', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  galleryText: { color: '#d4d4d8', fontSize: 12, fontWeight: '600' },
});