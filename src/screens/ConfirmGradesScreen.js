import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, FlatList } from 'react-native';
import { ArrowLeft, Trash2, Plus, CheckCircle2, RefreshCw, AlertTriangle, ChevronDown, Search, X } from 'lucide-react-native';
import { getLevelFromPercentage, MIN_SUBJECTS, getAddableSubjects, searchSubjects } from '../lib/grades';

export default function ConfirmGradesScreen({
  initialGrades = [],
  scanMeta = null,
  onBack = () => {},
  onRescan = () => {},
  onConfirm,
  onConfirmAndMatch,
}) {
  const [grades, setGrades] = useState(Array.isArray(initialGrades) ? initialGrades : []);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newPercentage, setNewPercentage] = useState('');
  const [showRaw, setShowRaw] = useState(false);

  const submitAction = onConfirm || onConfirmAndMatch || (() => {});
  const imageUri = scanMeta?.imageUri;
  const rawText = scanMeta?.rawText;
  const needsCheck = grades.filter((g) => g.confidence === 'low').length;

  // Editing a row marks it as reviewed (clears the "check" flag).
  const updateRow = (id, patch) =>
    setGrades((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch, confidence: 'high' } : g)));

  const handlePercentage = (id, text) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 3);
    if (digits === '') return updateRow(id, { percentage: '', level: 0 });
    const val = Math.min(100, Number(digits));
    updateRow(id, { percentage: val, level: getLevelFromPercentage(val) });
  };

  const handleDelete = (id) => setGrades((prev) => prev.filter((g) => g.id !== id));

  // Every NSC subject that is not already on the list
  const addableSubjects = useMemo(() => getAddableSubjects(grades), [grades]);
  const visibleSubjects = useMemo(() => searchSubjects(addableSubjects, search), [addableSubjects, search]);

  const openPicker = () => {
    setSearch('');
    setPickerOpen(true);
  };
  const closePicker = () => setPickerOpen(false);
  const chooseSubject = (subject) => {
    setSelectedSubject(subject);
    closePicker();
  };

  const handleAdd = () => {
    if (!selectedSubject) {
      Alert.alert('Choose a subject', 'Pick a subject from the list first.');
      return;
    }
    const score = Number(newPercentage);
    if (newPercentage === '' || isNaN(score) || score < 0 || score > 100) {
      Alert.alert('Invalid Marks', 'Percentage must be between 0 and 100.');
      return;
    }
    setGrades((prev) => [
      ...prev,
      {
        id: selectedSubject.id,
        name: selectedSubject.name,
        category: selectedSubject.category,
        level: getLevelFromPercentage(score),
        percentage: score,
        confidence: 'high',
      },
    ]);
    setSelectedSubject(null);
    setNewPercentage('');
  };

  const handleConfirm = () => {
    if (grades.some((g) => !String(g.name).trim())) {
      Alert.alert('Missing subject name', 'Give every row a subject name, or delete the empty rows.');
      return;
    }
    if (grades.some((g) => g.percentage === '' || g.percentage === null || isNaN(Number(g.percentage)))) {
      Alert.alert('Missing marks', 'Some subjects have no mark yet. Fill them in or delete those rows.');
      return;
    }
    const names = grades.map((g) => String(g.name).trim().toLowerCase());
    if (new Set(names).size !== names.length) {
      Alert.alert('Duplicate subject', 'The same subject appears twice. Delete one of them.');
      return;
    }
    if (grades.length < MIN_SUBJECTS) {
      Alert.alert('APS Minimum', `You need at least ${MIN_SUBJECTS} NSC subjects to generate an accurate university APS score.`);
      return;
    }
    // Strip the OCR-only flag before handing the grades to the rest of the app.
    submitAction(grades.map(({ confidence, ...rest }) => ({ ...rest, percentage: Number(rest.percentage) })));
  };

  const totalAps = grades.reduce((s, g) => s + (Number(g?.level) || 0), 0);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft color="#60a5fa" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Extracted Grades</Text>
        <TouchableOpacity onPress={onRescan} style={styles.rescanBtn}>
          <RefreshCw color="#60a5fa" size={14} />
          <Text style={styles.rescanText}>Rescan</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subPrompt}>
        Check each subject against your report card. Levels and total APS points update as you edit.
      </Text>

      {imageUri ? <Image source={{ uri: imageUri }} style={styles.thumb} resizeMode="contain" /> : null}

      {needsCheck > 0 && (
        <View style={styles.warnBox}>
          <AlertTriangle color="#fbbf24" size={16} />
          <Text style={styles.warnText}>
            {needsCheck} {needsCheck === 1 ? 'row needs' : 'rows need'} a quick check. The scan wasn't sure about these.
          </Text>
        </View>
      )}

      <View style={styles.list}>
        {grades.map((item) => {
          const flagged = item.confidence === 'low';
          return (
            <View key={item.id} style={[styles.row, flagged && styles.rowFlagged]}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.subjectInput}
                  value={item.name}
                  onChangeText={(txt) => updateRow(item.id, { name: txt })}
                  placeholder="Subject name"
                  placeholderTextColor="#71717a"
                />
                <Text style={styles.subjectCategory}>{flagged ? 'Check this row' : item.category}</Text>
              </View>
              <View style={styles.levelPill}>
                <Text style={styles.levelText}>{item.level ? `Lvl ${item.level}` : 'Lvl -'}</Text>
              </View>
              <TextInput
                style={[styles.percentInput, flagged && styles.percentInputFlagged]}
                keyboardType="numeric"
                value={String(item.percentage)}
                onChangeText={(txt) => handlePercentage(item.id, txt)}
                maxLength={3}
                placeholder="%"
                placeholderTextColor="#71717a"
              />
              <Text style={styles.percentSymbol}>%</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.delBtn}>
                <Trash2 color="#ef4444" size={16} />
              </TouchableOpacity>
            </View>
          );
        })}
        {grades.length === 0 && <Text style={styles.empty}>No subjects yet. Add them below.</Text>}
      </View>

      <View style={styles.addCard}>
        <Text style={styles.addTitle}>Add Additional NSC Subject</Text>
        <TouchableOpacity style={styles.dropdown} onPress={openPicker} activeOpacity={0.8}>
          <Text style={selectedSubject ? styles.dropdownValue : styles.dropdownPlaceholder} numberOfLines={1}>
            {selectedSubject ? selectedSubject.name : 'Select a subject...'}
          </Text>
          <ChevronDown color="#71717a" size={18} />
        </TouchableOpacity>
        <View style={styles.addInputs}>
          <TextInput
            placeholder="Mark %"
            placeholderTextColor="#71717a"
            style={styles.scoreInput}
            keyboardType="numeric"
            value={newPercentage}
            onChangeText={(t) => setNewPercentage(t.replace(/[^0-9]/g, '').slice(0, 3))}
            maxLength={3}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Plus color="#ffffff" size={18} />
            <Text style={styles.addBtnText}>Add subject</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={pickerOpen} animationType="slide" transparent onRequestClose={closePicker}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose a subject</Text>
              <TouchableOpacity onPress={closePicker} style={styles.modalClose}>
                <X color="#f4f4f5" size={18} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchBox}>
              <Search color="#71717a" size={16} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search subjects (e.g. maths, zulu, hl)"
                placeholderTextColor="#71717a"
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            </View>
            <Text style={styles.modalCount}>
              {visibleSubjects.length} of {addableSubjects.length} subjects not on your list
            </Text>
            <FlatList
              data={visibleSubjects}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => chooseSubject(item)}>
                  <Text style={styles.optionName}>{item.name}</Text>
                  <Text style={styles.optionCategory}>{item.category}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.modalEmpty}>
                  {addableSubjects.length === 0 ? 'Every NSC subject is already on your list.' : 'No subjects match your search.'}
                </Text>
              }
            />
          </View>
        </View>
      </Modal>

      <View style={styles.apsSummary}>
        <Text style={styles.apsLabel}>Calculated APS Points:</Text>
        <Text style={styles.apsValue}>{totalAps} Points</Text>
      </View>

      {rawText ? (
        <TouchableOpacity onPress={() => setShowRaw((v) => !v)}>
          <Text style={styles.rawToggle}>{showRaw ? 'Hide' : 'Show'} text the scan read</Text>
          {showRaw && <Text style={styles.rawText}>{rawText}</Text>}
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.confirmBtnText}>Save & View Matching Degrees</Text>
        <CheckCircle2 color="#ffffff" size={18} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  headerTitle: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold', flex: 1 },
  rescanBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#18181b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  rescanText: { color: '#60a5fa', fontSize: 12, fontWeight: '600' },
  subPrompt: { color: '#a1a1aa', fontSize: 13, marginBottom: 16, lineHeight: 18 },
  thumb: { width: '100%', height: 150, borderRadius: 12, backgroundColor: '#141416', marginBottom: 12 },
  warnBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#2a2108', borderColor: '#78590f', borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 12 },
  warnText: { color: '#fcd34d', fontSize: 12, flex: 1, lineHeight: 16 },
  list: { backgroundColor: '#141416', borderRadius: 14, borderWidth: 1, borderColor: '#27272a', padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: '#27272a', gap: 8 },
  rowFlagged: { backgroundColor: '#1f1a0b', borderRadius: 8 },
  subjectInput: { color: '#f4f4f5', fontSize: 14, fontWeight: '600', padding: 0 },
  subjectCategory: { color: '#71717a', fontSize: 11 },
  levelPill: { backgroundColor: '#1e3a8a', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  levelText: { color: '#bfdbfe', fontSize: 11, fontWeight: 'bold' },
  percentInput: { backgroundColor: '#27272a', color: '#ffffff', width: 44, padding: 6, borderRadius: 6, textAlign: 'center', fontWeight: 'bold' },
  percentInputFlagged: { borderWidth: 1, borderColor: '#f59e0b' },
  percentSymbol: { color: '#71717a', fontSize: 12 },
  delBtn: { padding: 4 },
  empty: { color: '#71717a', fontSize: 13, textAlign: 'center', padding: 16 },
  addCard: { backgroundColor: '#141416', padding: 12, borderRadius: 14, marginTop: 16, borderWidth: 1, borderColor: '#27272a' },
  addTitle: { color: '#f4f4f5', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  addInputs: { flexDirection: 'row', gap: 8, marginTop: 8 },
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#27272a', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, gap: 8 },
  dropdownValue: { color: '#ffffff', fontSize: 13, flex: 1 },
  dropdownPlaceholder: { color: '#71717a', fontSize: 13, flex: 1 },
  scoreInput: { width: 84, backgroundColor: '#27272a', color: '#ffffff', padding: 10, borderRadius: 8, textAlign: 'center', fontSize: 13 },
  addBtn: { flex: 1, flexDirection: 'row', gap: 6, backgroundColor: '#2563eb', padding: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#141416', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, height: '75%', borderWidth: 1, borderColor: '#27272a' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  modalClose: { backgroundColor: '#27272a', padding: 6, borderRadius: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#27272a', borderRadius: 10, paddingHorizontal: 12 },
  searchInput: { flex: 1, color: '#ffffff', paddingVertical: 10, fontSize: 14 },
  modalCount: { color: '#71717a', fontSize: 11, marginVertical: 8 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#27272a', gap: 8 },
  optionName: { color: '#f4f4f5', fontSize: 14, flex: 1 },
  optionCategory: { color: '#71717a', fontSize: 11 },
  modalEmpty: { color: '#71717a', fontSize: 13, textAlign: 'center', padding: 24 },
  apsSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#172554', padding: 16, borderRadius: 14, marginVertical: 16 },
  apsLabel: { color: '#bfdbfe', fontWeight: '600', fontSize: 14 },
  apsValue: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
  rawToggle: { color: '#71717a', fontSize: 12, textAlign: 'center', marginBottom: 8 },
  rawText: { color: '#a1a1aa', fontSize: 11, fontFamily: 'monospace', backgroundColor: '#141416', padding: 10, borderRadius: 8, marginBottom: 12 },
  confirmBtn: { backgroundColor: '#2563eb', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 14, gap: 8, marginBottom: 20 },
  confirmBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
