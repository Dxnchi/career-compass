import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react-native';

export default function MatchesScreen({
  matches = [],
  onBack = () => {},
  onSelectProgram = () => {},
}) {
  const [filter, setFilter] = useState('all');

  const safeMatches = Array.isArray(matches) ? matches : [];
  const filtered = safeMatches.filter((item) => {
    if (!item) return false;
    if (filter === 'eligible') return item.status === 'eligible';
    if (filter === 'tech') return item.category === 'Tech';
    if (filter === 'engineering') return item.category === 'Engineering';
    return true;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft color="#60a5fa" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Degree Matches</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {[
          { id: 'all', label: 'All Degrees' },
          { id: 'eligible', label: 'Direct Entry Only' },
          { id: 'tech', label: 'Computing & IT' },
          { id: 'engineering', label: 'Engineering' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.filterChip, filter === tab.id && styles.filterChipActive]}
            onPress={() => setFilter(tab.id)}
          >
            <Text style={[styles.filterLabel, filter === tab.id && styles.filterLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.cardList}>
        {filtered.length > 0 ? (
          filtered.map((prog) => (
            <TouchableOpacity
              key={prog.id || Math.random().toString()}
              style={styles.card}
              onPress={() => onSelectProgram(prog)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{prog.title || 'Degree'}</Text>
                {prog.status === 'eligible' && (
                  <View style={[styles.badge, { backgroundColor: '#064e3b' }]}>
                    <CheckCircle2 color="#34d399" size={13} />
                    <Text style={[styles.badgeText, { color: '#34d399' }]}>Eligible</Text>
                  </View>
                )}
                {prog.status === 'close' && (
                  <View style={[styles.badge, { backgroundColor: '#451a03' }]}>
                    <AlertTriangle color="#fbbf24" size={13} />
                    <Text style={[styles.badgeText, { color: '#fbbf24' }]}>Close Match</Text>
                  </View>
                )}
                {prog.status === 'not_eligible' && (
                  <View style={[styles.badge, { backgroundColor: '#27272a' }]}>
                    <XCircle color="#a1a1aa" size={13} />
                    <Text style={[styles.badgeText, { color: '#a1a1aa' }]}>Below Threshold</Text>
                  </View>
                )}
              </View>

              <Text style={styles.uniName}>{prog.universityName || 'University'}</Text>
              {prog.missingNote && (
                <Text style={styles.missingWarning}>{prog.missingNote}</Text>
              )}

              <View style={styles.metaRow}>
                <Text style={styles.apsLabel}>Req APS: <Text style={styles.apsValue}>{prog.requiredAps || '--'}</Text></Text>
                <Text style={styles.matchScore}>{prog.matchScore || 0}% Compatibility</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No matching programs for this filter.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  headerTitle: { color: '#f4f4f5', fontSize: 20, fontWeight: 'bold' },
  filterBar: { flexDirection: 'row', marginBottom: 16 },
  filterChip: { backgroundColor: '#141416', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#27272a' },
  filterChipActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  filterLabel: { color: '#71717a', fontSize: 12, fontWeight: '600' },
  filterLabelActive: { color: '#ffffff' },
  cardList: { gap: 12 },
  card: { backgroundColor: '#141416', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#27272a' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  title: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold', flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  uniName: { color: '#a1a1aa', fontSize: 13, marginTop: 4 },
  missingWarning: { color: '#fbbf24', fontSize: 12, marginTop: 6, backgroundColor: '#291804', padding: 6, borderRadius: 6 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#27272a' },
  apsLabel: { color: '#71717a', fontSize: 12 },
  apsValue: { color: '#60a5fa', fontWeight: 'bold' },
  matchScore: { color: '#34d399', fontSize: 12, fontWeight: 'bold' },
  emptyWrap: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#71717a', fontSize: 13 },
});
