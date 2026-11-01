import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, AlertCircle } from 'lucide-react-native';

export default function MatchesScreen({
  matches = [],
  onBack = () => {},
  onSelectProgram = () => {},
}) {
  const [filter, setFilter] = useState('all');

  const safeMatches = Array.isArray(matches) ? matches : [];

  const filtered = safeMatches.filter((item) => {
    if (!item) return false;
    const isDirect = item.status === 'DIRECT_MATCH' || item.status === 'eligible';
    const isECP = item.status === 'ECP_ELIGIBLE' || item.status === 'close';
    const facultyStr = (item.faculty || item.category || '').toLowerCase();

    if (filter === 'eligible') return isDirect;
    if (filter === 'ecp') return isECP;
    if (filter === 'tech') return facultyStr.includes('science') || facultyStr.includes('tech') || facultyStr.includes('informat');
    if (filter === 'engineering') return facultyStr.includes('engineering') || facultyStr.includes('built');
    if (filter === 'business') return facultyStr.includes('business') || facultyStr.includes('economic') || facultyStr.includes('commerce');
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
          { id: 'eligible', label: 'Direct Entry' },
          { id: 'ecp', label: 'Extended (ECP)' },
          { id: 'tech', label: 'Computing & IT' },
          { id: 'engineering', label: 'Engineering' },
          { id: 'business', label: 'Commerce' },
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
          filtered.map((prog, index) => {
            const isDirect = prog.status === 'DIRECT_MATCH' || prog.status === 'eligible';
            const isECP = prog.status === 'ECP_ELIGIBLE' || prog.status === 'close';
            const missingReqs = prog.missingRequirements || [];
            const hasMissingSubjects = missingReqs.length > 0;

            return (
              <TouchableOpacity
                key={prog.id || prog.programmeId || `prog-${index}`}
                style={styles.card}
                onPress={() => onSelectProgram(prog)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{prog.title || prog.programmeName || prog.name || 'Degree'}</Text>
                  
                  {isDirect && (
                    <View style={[styles.badge, { backgroundColor: '#064e3b' }]}>
                      <CheckCircle2 color="#34d399" size={13} />
                      <Text style={[styles.badgeText, { color: '#34d399' }]}>Direct Entry</Text>
                    </View>
                  )}

                  {isECP && (
                    <View style={[styles.badge, { backgroundColor: '#451a03' }]}>
                      <AlertTriangle color="#fbbf24" size={13} />
                      <Text style={[styles.badgeText, { color: '#fbbf24' }]}>Extended (ECP)</Text>
                    </View>
                  )}

                  {!isDirect && !isECP && (
                    <View style={[styles.badge, { backgroundColor: '#27272a' }]}>
                      <XCircle color="#a1a1aa" size={13} />
                      <Text style={[styles.badgeText, { color: '#a1a1aa' }]}>Ineligible</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.uniName}>
                  {prog.universityName || 'South African University'}
                  {prog.faculty ? ` • ${prog.faculty}` : ''}
                </Text>

                {/* Explicit prerequisite error message */}
                {hasMissingSubjects ? (
                  <View style={styles.warningBox}>
                    <AlertCircle color="#f87171" size={13} style={{ marginTop: 2 }} />
                    <Text style={styles.warningText}>
                      Missing: {missingReqs.map(r => `${r.subject} (Req L${r.required})`).join(', ')}
                    </Text>
                  </View>
                ) : prog.missingNote ? (
                  <View style={styles.warningBox}>
                    <AlertCircle color="#fbbf24" size={13} style={{ marginTop: 2 }} />
                    <Text style={[styles.warningText, { color: '#fbbf24' }]}>{prog.missingNote}</Text>
                  </View>
                ) : null}

                <View style={styles.metaRow}>
                  <Text style={styles.apsLabel}>
                    Req APS: <Text style={styles.apsValue}>{prog.requiredAps || prog.minAPS || '--'}</Text>
                  </Text>
                  <Text style={styles.matchScore}>{prog.matchScore || 0}% Match</Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: '#2a1215', padding: 8, borderRadius: 8, marginTop: 8 },
  warningText: { color: '#f87171', fontSize: 12, flex: 1, lineHeight: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#27272a' },
  apsLabel: { color: '#71717a', fontSize: 12 },
  apsValue: { color: '#60a5fa', fontWeight: 'bold' },
  matchScore: { color: '#34d399', fontSize: 12, fontWeight: 'bold' },
  emptyWrap: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#71717a', fontSize: 13 },
});
