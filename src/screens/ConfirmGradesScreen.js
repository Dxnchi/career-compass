import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ArrowLeft, Trash2, Plus, CheckCircle2 } from 'lucide-react-native';
import { getLevelFromPercentage } from '../data/dataStore';

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

  const handleUpdate = (id, percentage) => {
    const val = Number(percentage);
    if (isNaN(val) || val < 0 || val > 100) return;
    setGrades((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, percentage: val, level: getLevelFromPercentage(val) } : g
      )
    );
  };

  const handleDelete = (id) => {
    if (grades.length <= 4) {
      Alert.alert('APS Minimum', 'You need at least 6 NSC subjects to generate an accurate university APS score.');
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

    setGrades((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: newSubject.trim(),
        category: 'Elective',
        level: getLevelFromPercentage(score),
        percentage: score,
      },
    ]);
    setNewSubject('');
    setNewPercentage('');
  };

  const totalAps = Array.isArray(grades)
    ? grades.reduce((s, g) => s + (Number(g?.level) || 0), 0)
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft color="#60a5fa" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Extracted Grades</Text>
      </View>

      <Text style={styles.subPrompt}>
        Verify your NSC subject percentages. Levels and total APS points are calculated dynamically.
      </Text>

      <View style={styles.list}>
        {grades.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subjectName}>{item.name}</Text>
              <Text style={styles.subjectCategory}>{item.category}</Text>
            </View>
            <View style={styles.levelPill}>
              <Text style={styles.levelText}>Lvl {item.level}</Text>
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
              <Trash2 color="#ef4444" size={16} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.addCard}>
        <Text style={styles.addTitle}>Add Additional NSC Subject</Text>
        <View style={styles.addInputs}>
          <TextInput
            placeholder="Subject Name (e.g. Accounting)"
            placeholderTextColor="#71717a"
            style={styles.nameInput}
            value={newSubject}
            onChangeText={setNewSubject}
          />
          <TextInput
            placeholder="%"
            placeholderTextColor="#71717a"
            style={styles.scoreInput}
            keyboardType="numeric"
            value={newPercentage}
            onChangeText={setNewPercentage}
            maxLength={3}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Plus color="#ffffff" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.apsSummary}>
        <Text style={styles.apsLabel}>Calculated APS Points:</Text>
        <Text style={styles.apsValue}>{totalAps} Points</Text>
      </View>

      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => submitAction(grades)}
      >
        <Text style={styles.confirmBtnText}>Save & View Matching Degrees</Text>
        <CheckCircle2 color="#ffffff" size={18} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  headerTitle: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  subPrompt: { color: '#a1a1aa', fontSize: 13, marginBottom: 16, lineHeight: 18 },
  list: { backgroundColor: '#141416', borderRadius: 14, borderWidth: 1, borderColor: '#27272a', padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: '#27272a', gap: 8 },
  subjectName: { color: '#f4f4f5', fontSize: 14, fontWeight: '600' },
  subjectCategory: { color: '#71717a', fontSize: 11 },
  levelPill: { backgroundColor: '#1e3a8a', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  levelText: { color: '#bfdbfe', fontSize: 11, fontWeight: 'bold' },
  percentInput: { backgroundColor: '#27272a', color: '#ffffff', width: 44, padding: 6, borderRadius: 6, textAlign: 'center', fontWeight: 'bold' },
  percentSymbol: { color: '#71717a', fontSize: 12 },
  delBtn: { padding: 4 },
  addCard: { backgroundColor: '#141416', padding: 12, borderRadius: 14, marginTop: 16, borderWidth: 1, borderColor: '#27272a' },
  addTitle: { color: '#f4f4f5', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  addInputs: { flexDirection: 'row', gap: 8 },
  nameInput: { flex: 1, backgroundColor: '#27272a', color: '#ffffff', padding: 10, borderRadius: 8, fontSize: 13 },
  scoreInput: { width: 50, backgroundColor: '#27272a', color: '#ffffff', padding: 10, borderRadius: 8, textAlign: 'center', fontSize: 13 },
  addBtn: { backgroundColor: '#2563eb', padding: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  apsSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#172554', padding: 16, borderRadius: 14, marginVertical: 16 },
  apsLabel: { color: '#bfdbfe', fontWeight: '600', fontSize: 14 },
  apsValue: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
  confirmBtn: { backgroundColor: '#2563eb', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 14, gap: 8, marginBottom: 20 },
  confirmBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
