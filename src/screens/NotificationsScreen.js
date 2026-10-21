import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { DEADLINES_DATA } from '../data/dataStore';

export default function NotificationsScreen({
  deadlines = DEADLINES_DATA,
  onBack = () => {},
}) {
  const safeDeadlines = Array.isArray(deadlines) ? deadlines : DEADLINES_DATA;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft color="#60a5fa" size={22} />
          </TouchableOpacity>
        )}
        <Text style={styles.heading}>Notifications</Text>
      </View>

      <Text style={styles.subtitle}>Important application and funding dates.</Text>

      {safeDeadlines.length > 0 ? (
        safeDeadlines.map((deadline) => (
          <View key={deadline?.id || Math.random().toString()} style={styles.card}>
            <View style={styles.date}>
              <Text style={styles.month}>{deadline?.month || 'DATE'}</Text>
              <Text style={styles.day}>{deadline?.day || '--'}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{deadline?.title || 'Notice'}</Text>
              <Text style={styles.text}>{deadline?.subtitle || ''}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No notifications or deadlines available.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  backBtn: { padding: 4 },
  heading: { color: '#f4f4f5', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#a1a1aa', fontSize: 13, marginBottom: 16 },
  card: { backgroundColor: '#141416', borderRadius: 14, borderWidth: 1, borderColor: '#27272a', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  date: { backgroundColor: '#27272a', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6, alignItems: 'center', width: 48 },
  month: { color: '#f87171', fontSize: 11, fontWeight: 'bold' },
  day: { color: '#f4f4f5', fontSize: 15, fontWeight: 'bold' },
  content: { flex: 1 },
  title: { color: '#f4f4f5', fontSize: 14, fontWeight: '600' },
  text: { color: '#71717a', fontSize: 12, marginTop: 2 },
  emptyCard: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#71717a', fontSize: 13 },
});
