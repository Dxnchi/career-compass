// src/screens/MatchesScreen.js
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, AlertCircle, ExternalLink, ChevronRight } from 'lucide-react-native';

const FACULTY_FILTERS = [
  { id: 'all', label: 'All Degrees' },
  { id: 'commerce', label: 'Commerce, Economic & Management Sciences' },
  { id: 'engineering', label: 'Engineering & the Built Environment' },
  { id: 'health', label: 'Health Sciences & Medicine' },
  { id: 'science', label: 'Science / Natural & Agricultural Sciences' },
  { id: 'humanities', label: 'Humanities & Social Sciences' },
  { id: 'law', label: 'Law' },
  { id: 'education', label: 'Education' },
  { id: 'niche', label: 'Veterinary Science, Theology & Religion' },
];

function matchesFacultyCategory(facultyStr = '', filterId) {
  const f = facultyStr.toLowerCase();
  switch (filterId) {
    case 'commerce':
      return f.includes('commerce') || f.includes('economic') || f.includes('management') || f.includes('business');
    case 'engineering':
      return f.includes('engineering') || f.includes('built');
    case 'health':
      return f.includes('health') || f.includes('medicine') || f.includes('medical');
    case 'science':
      return (
        (f.includes('science') && !f.includes('health') && !f.includes('social') && !f.includes('management') && !f.includes('veterinary')) ||
        f.includes('natural') ||
        f.includes('agricultural') ||
        f.includes('tech') ||
        f.includes('informat')
      );
    case 'humanities':
      return f.includes('humanities') || f.includes('social') || f.includes('arts');
    case 'law':
      return f.includes('law') || f.includes('juridical');
    case 'education':
      return f.includes('education');
    case 'niche':
      return f.includes('veterinary') || f.includes('theology') || f.includes('religion') || f.includes('niche');
    default:
      return true;
  }
}

export default function MatchesScreen({
  matches = [],
  onBack = () => {},
  onSelectProgram = () => {},
}) {
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [universityFilter, setUniversityFilter] = useState('All');

  const safeMatches = Array.isArray(matches) ? matches : [];

  // Extract unique universities dynamically from the matches list
  const universities = useMemo(() => {
    const set = new Set();
    safeMatches.forEach((m) => {
      const uni = m.universityName || m.university || m.institution;
      if (uni) {
        set.add(uni);
      }
    });
    return ['All', ...Array.from(set)];
  }, [safeMatches]);

  // Filter matches by both Faculty category and University
  const filtered = safeMatches.filter((item) => {
    if (!item) return false;
    
    // Faculty Filter Check
    const facultyStr = item.faculty || item.category || '';
    const matchesFaculty = matchesFacultyCategory(facultyStr, facultyFilter);

    // University Filter Check
    const uniName = item.universityName || item.university || item.institution || 'South African University';
    const matchesUni = universityFilter === 'All' || uniName === universityFilter;

    return matchesFaculty && matchesUni;
  });

  const openCourseUrl = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.warn('Could not open course URL:', e);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft color="#60a5fa" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Degree Matches</Text>
      </View>

      {/* University Filter Tabs */}
      {universities.length > 1 && (
        <View style={styles.filterWrapper}>
          <Text style={styles.filterSectionTitle}>Filter by University</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
            {universities.map((uni) => (
              <TouchableOpacity
                key={uni}
                style={[styles.uniChip, universityFilter === uni && styles.uniChipActive]}
                onPress={() => setUniversityFilter(uni)}
              >
                <Text style={[styles.uniChipLabel, universityFilter === uni && styles.uniChipLabelActive]}>
                  {uni}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Faculty Filter Tabs */}
      <View style={styles.filterWrapper}>
        <Text style={styles.filterSectionTitle}>Filter by Faculty</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
          {FACULTY_FILTERS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.filterChip, facultyFilter === tab.id && styles.filterChipActive]}
              onPress={() => setFacultyFilter(tab.id)}
            >
              <Text style={[styles.filterLabel, facultyFilter === tab.id && styles.filterLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.cardList}>
          {filtered.length > 0 ? (
            filtered.map((prog, index) => {
              const hasStudentAps = (prog.studentAps || 0) > 0;
              const isDirect = hasStudentAps && (prog.status === 'DIRECT_MATCH' || prog.status === 'eligible' || prog.isEligible);
              const isECP = hasStudentAps && (prog.status === 'ECP_ELIGIBLE' || prog.status === 'close');
              const missingReqs = prog.missingRequirements || [];
              const hasMissingSubjects = hasStudentAps && missingReqs.length > 0;

              return (
                <TouchableOpacity
                  key={prog.id || prog.programmeId || `prog-${index}`}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => onSelectProgram(prog)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.title}>{prog.title || prog.programmeName || prog.name || 'Degree'}</Text>

                    {isDirect && (
                      <View style={[styles.badge, { backgroundColor: '#064e3b' }]}>
                        <CheckCircle2 color="#34d399" size={13} />
                        <Text style={[styles.badgeText, { color: '#34d399' }]}>Eligible</Text>
                      </View>
                    )}

                    {isECP && (
                      <View style={[styles.badge, { backgroundColor: '#451a03' }]}>
                        <AlertTriangle color="#fbbf24" size={13} />
                        <Text style={[styles.badgeText, { color: '#fbbf24' }]}>Extended (ECP)</Text>
                      </View>
                    )}

                    {!isDirect && !isECP && (
                      <View style={[styles.badge, { backgroundColor: '#2a1215', borderColor: '#7f1d1d', borderWidth: 1 }]}>
                        <XCircle color="#f87171" size={13} />
                        <Text style={[styles.badgeText, { color: '#f87171' }]}>
                          {hasStudentAps ? 'Not Eligible' : 'Scan to Check Eligibility'}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.uniName}>
                    {prog.universityName || prog.university || prog.institution || 'South African University'}
                    {prog.faculty ? ` • ${prog.faculty}` : ''}
                  </Text>

                  {hasMissingSubjects ? (
                    <View style={styles.warningBox}>
                      <AlertCircle color="#f87171" size={13} style={{ marginTop: 2 }} />
                      <Text style={styles.warningText}>
                        Missing: {missingReqs.map((r) => `${r.subject} (Req L${r.required})`).join(', ')}
                      </Text>
                    </View>
                  ) : prog.missingNote && hasStudentAps ? (
                    <View style={styles.warningBox}>
                      <AlertCircle color="#fbbf24" size={13} style={{ marginTop: 2 }} />
                      <Text style={[styles.warningText, { color: '#fbbf24' }]}>{prog.missingNote}</Text>
                    </View>
                  ) : null}

                  <View style={styles.metaRow}>
                    <View style={styles.apsGroup}>
                      <Text style={styles.apsLabel}>
                        Req APS: <Text style={styles.apsValue}>{prog.requiredAps || prog.min_aps || prog.minAPS || '--'}</Text>
                      </Text>
                      {hasStudentAps && (
                        <Text style={styles.matchScore}> {prog.matchScore || 0}% Match</Text>
                      )}
                    </View>

                    <View style={styles.actionsGroup}>
                      {prog.courseUrl && (
                        <TouchableOpacity
                          style={styles.uniLinkBtn}
                          onPress={(e) => {
                            e.stopPropagation?.();
                            openCourseUrl(prog.courseUrl);
                          }}
                        >
                          <Text style={styles.uniLinkText}>Course Page</Text>
                          <ExternalLink color="#60a5fa" size={12} />
                        </TouchableOpacity>
                      )}
                      <View style={styles.overviewLink}>
                        <Text style={styles.overviewText}>Overview</Text>
                        <ChevronRight color="#a1a1aa" size={14} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No programmes found for this filter combination.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0a0a0a' },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { color: '#f4f4f5', fontSize: 20, fontWeight: 'bold' },
  filterWrapper: { paddingHorizontal: 16, marginBottom: 12 },
  filterSectionTitle: { color: '#a1a1aa', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 6 },
  filterBar: { flexDirection: 'row', maxHeight: 40 },
  filterContent: { alignItems: 'center' },
  filterChip: { backgroundColor: '#141416', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#27272a', height: 34, justifyContent: 'center' },
  filterChipActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  filterLabel: { color: '#71717a', fontSize: 12, fontWeight: '600' },
  filterLabelActive: { color: '#ffffff' },
  uniChip: { backgroundColor: '#141416', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: '#27272a', height: 32, justifyContent: 'center' },
  uniChipActive: { backgroundColor: '#059669', borderColor: '#10b981' },
  uniChipLabel: { color: '#71717a', fontSize: 11, fontWeight: '600' },
  uniChipLabelActive: { color: '#ffffff' },
  cardList: { gap: 12 },
  card: { backgroundColor: '#141416', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#27272a' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  title: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold', flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  uniName: { color: '#a1a1aa', fontSize: 13, marginTop: 4 },
  warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: '#2a1215', padding: 8, borderRadius: 8, marginTop: 8 },
  warningText: { color: '#f87171', fontSize: 12, flex: 1, lineHeight: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#27272a' },
  apsGroup: { flexDirection: 'row', alignItems: 'center' },
  apsLabel: { color: '#71717a', fontSize: 12 },
  apsValue: { color: '#60a5fa', fontWeight: 'bold' },
  matchScore: { color: '#34d399', fontSize: 12, fontWeight: 'bold' },
  actionsGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  uniLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  uniLinkText: { color: '#60a5fa', fontSize: 11, fontWeight: '600' },
  overviewLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  overviewText: { color: '#d4d4d8', fontSize: 12, fontWeight: '600' },
  emptyWrap: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#71717a', fontSize: 13 },
});
