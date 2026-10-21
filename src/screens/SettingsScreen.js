import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ArrowLeft, Shield, LogOut } from 'lucide-react-native';

export default function SettingsScreen({
  user = {},
  onBack = () => {},
  onSaveUser,
  onUpdateUser,
  onLogout = () => {},
}) {
  const [name, setName] = useState(user?.name || '');
  const [school, setSchool] = useState(user?.school || '');

  const saveAction = onSaveUser || onUpdateUser || (() => {});

  const handleSave = () => {
    saveAction({ ...user, name, school });
    Alert.alert('Updated', 'Profile settings updated.');
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
        />

        <Text style={styles.inputLabel}>High School</Text>
        <TextInput
          style={styles.input}
          value={school}
          onChangeText={setSchool}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.groupHeader}>Legal & POPIA</Text>
      <View style={styles.box}>
        <View style={styles.infoRow}>
          <Shield color="#3b82f6" size={18} />
          <Text style={styles.infoText}>POPIA Act compliant. Transcript data is processed on-device.</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <LogOut color="#ef4444" size={18} />
        <Text style={styles.logoutText}>Reset App State</Text>
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
  inputLabel: { color: '#a1a1aa', fontSize: 12 },
  input: { backgroundColor: '#27272a', color: '#ffffff', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 6 },
  saveBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  infoRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  infoText: { color: '#a1a1aa', fontSize: 12, flex: 1, lineHeight: 18 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 14, backgroundColor: '#2d1214', borderRadius: 12, marginTop: 24, borderWidth: 1, borderColor: '#7f1d1d' },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 13 },
});
