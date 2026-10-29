import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native';
import { ArrowLeft, Trash2, Plus, CheckCircle2, GraduationCap } from 'lucide-react-native';
import { calculateAPS } from '../utils/apsCalculator';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

// Fallback percentage-to-level mapping if not imported
function getLevelFromPercentage(percentage) {
  const p = Number(percentage);
  if (p >= 80) return 7;
  if (p >= 70) return 6;
  if (p >= 60) return 5;
  if (p >= 50) return 4;
  if (p >= 40) return 3;
  if (p >= 30) return 2;
  return 1;
}

export default function ConfirmGradesScreen({
  initialGrades = [],
  onBack = () => {},
  onConfirm,
  onConfirmAndMatch,
}) {
  const [grades, setGrades] = useState(Array.isArray(initialGrades) ? initialGrades : []);
  const [newSubject, setNewSubject] = useState('');
  const [newPercentage, setNewPercentage] = useState('');

  const submitAction = onConfirm || onConfirmAndMatch || (() => {});

  // --- YOUR EXACT LOGIC (UNTOUCHED) ---
  const handleUpdate = (id, text) => {
    if (text === '') {
      setGrades((prev) =>
        prev.map((g) => (g.id === id ? { ...g, percentage: '', level: 0 } : g))
      );
      return;
    }

    const val = Number(text);
    if (isNaN(val) || val < 0 || val > 100) return;

    setGrades((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              percentage: val,
              level: getLevelFromPercentage(val),
            }
          : g
      )
    );
  };

  const handleDelete = (id) => {
    if (grades.length <= 4) {
      Alert.alert(
        'NSC Minimum',
        'You need at least 6 subjects (excluding Life Orientation) for a complete university admission evaluation.'
      );
      return;
    }
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAdd = () => {
    if (!newSubject.trim()) {
      Alert.alert('Required', 'Please enter a valid subject name.');
      return;
    }
    const score = Number(newPercentage);
    if (isNaN(score) || score < 0 || score > 100) {
      Alert.alert('Invalid Marks', 'Percentage must be between 0 and 100.');
      return;
    }

    const isLO = newSubject.trim().toLowerCase().includes('life orientation');

    setGrades((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: newSubject.trim(),
        category: isLO ? 'Core Subject' : 'Elective',
        level: getLevelFromPercentage(score),
        percentage: score,
      },
    ]);
    setNewSubject('');
    setNewPercentage('');
  };

  const totalAps = useMemo(() => {
    const validGrades = grades.map((g) => ({
      subject: g.name,
      percentage: Number(g.percentage) || 0,
      level: g.level,
    }));
    const { totalAPS } = calculateAPS(validGrades);
    return totalAPS;
  }, [grades]);

  const handleConfirmAndProceed = () => {
    const sanitizedGrades = grades.map((g) => ({
      ...g,
      percentage: Number(g.percentage) || 0,
      level: getLevelFromPercentage(Number(g.percentage) || 0),
    }));
    submitAction(sanitizedGrades);
  };
  // --- END OF YOUR LOGIC ---


  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <ArrowLeft color={COLORS.textDark} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Grades</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Success Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successIcon}>
            <CheckCircle2 color={COLORS.white} size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.successTitle}>Scan Complete!</Text>
            <Text style={styles.successSubtitle}>Here are the grades we found from your report card.</Text>
          </View>
        </View>

        {/* Grades List */}
        <View style={styles.list}>
          {grades.map((item) => {
            const isLO = item.name?.toLowerCase().includes('life orientation');

            return (
              <View key={item.id} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subjectName}>{item.name}</Text>
                  {isLO && <Text style={styles.subjectCategory}>Excluded from APS</Text>}
                </View>

                {/* Keeping your Level Pill but making it subtle */}
                <View style={[styles.levelPill, isLO && styles.loLevelPill]}>
                  <Text style={[styles.levelText, isLO && styles.loLevelText]}>
                    Lvl {item.level || 0}
                  </Text>
                </View>

                <TextInput
                  style={styles.percentInput}
                  keyboardType="numeric"
                  value={String(item.percentage)}
                  onChangeText={(txt) => handleUpdate(item.id, txt)}
                  maxLength={3}
                />
                <Text style={styles.percentSymbol}>%</Text>

                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.delBtn}>
                  <Trash2 color={COLORS.textGray} size={18} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Add Subject Card */}
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Add Missing Subject</Text>
          <View style={styles.addInputs}>
            <TextInput
              placeholder="Subject Name"
              placeholderTextColor={COLORS.textGray}
              style={styles.nameInput}
              value={newSubject}
              onChangeText={setNewSubject}
            />
            <TextInput
              placeholder="%"
              placeholderTextColor={COLORS.textGray}
              style={styles.scoreInput}
              keyboardType="numeric"
              value={newPercentage}
              onChangeText={setNewPercentage}
              maxLength={3}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Plus color={COLORS.white} size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* APS Summary (Replaced with Prototype styling) */}
        <View style={styles.apsSummary}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.apsIconBg}>
              <GraduationCap color={COLORS.primary} size={24} />
            </View>
            <Text style={styles.apsLabel}>Total APS Score</Text>
          </View>
          <Text style={styles.apsValue}>{totalAps}</Text>
        </View>

      </ScrollView>

      {/* Fixed Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmAndProceed}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 10
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.light
  },
  headerTitle: { fontSize: SIZES.h3, fontWeight: '700', color: COLORS.textDark },

  // Success Banner
  successBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.successBg,
    marginHorizontal: SIZES.padding,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  successIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.successText,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12
  },
  successTitle: { fontSize: 16, fontWeight: '700', color: COLORS.successText, marginBottom: 4 },
  successSubtitle: { fontSize: 12, color: COLORS.successText, opacity: 0.8 },

  // Grades List
  list: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    ...SHADOWS.light
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0', 
    gap: 10 
  },
  subjectName: { color: COLORS.textDark, fontSize: 15, fontWeight: '600' },
  subjectCategory: { color: COLORS.textGray, fontSize: 11, marginTop: 2 },
  
  levelPill: { backgroundColor: '#E8E0FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  levelText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  loLevelPill: { backgroundColor: '#F8F9FA' },
  loLevelText: { color: COLORS.textGray },
  
  percentInput: { 
    backgroundColor: '#F8F9FA', 
    color: COLORS.textDark, 
    width: 46, 
    padding: 8, 
    borderRadius: 8, 
    textAlign: 'center', 
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  percentSymbol: { color: COLORS.textGray, fontSize: 14, fontWeight: '600' },
  delBtn: { padding: 8 },

  // Add Card
  addCard: { 
    backgroundColor: COLORS.white, 
    padding: 16, 
    borderRadius: SIZES.radius, 
    marginHorizontal: SIZES.padding,
    marginTop: 16, 
    ...SHADOWS.light 
  },
  addTitle: { color: COLORS.textDark, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  addInputs: { flexDirection: 'row', gap: 8 },
  nameInput: { flex: 1, backgroundColor: '#F8F9FA', color: COLORS.textDark, padding: 12, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  scoreInput: { width: 50, backgroundColor: '#F8F9FA', color: COLORS.textDark, padding: 12, borderRadius: 8, textAlign: 'center', fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  addBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  // APS Summary
  apsSummary: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    padding: 20, 
    borderRadius: SIZES.radius, 
    marginHorizontal: SIZES.padding,
    marginVertical: 24,
    ...SHADOWS.light
  },
  apsIconBg: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0EBFF',
    justifyContent: 'center', alignItems: 'center'
  },
  apsLabel: { color: COLORS.textDark, fontWeight: '700', fontSize: 16 },
  apsValue: { color: COLORS.primary, fontWeight: '800', fontSize: 28 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmBtn: { 
    backgroundColor: COLORS.primary, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 16, 
    borderRadius: SIZES.radius, 
    ...SHADOWS.light
  },
  confirmBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});