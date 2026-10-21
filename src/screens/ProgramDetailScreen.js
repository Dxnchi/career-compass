import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react-native';

export default function ProgramDetailScreen({
  program = {},
  onBack = () => {},
  onStartApplication = () => {},
}) {
  const requirements = Array.isArray(program?.admissionRequirements)
    ? program.admissionRequirements
    : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft color="#60a5fa" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Degree Overview</Text>
      </View>

      {program?.coverImage ? (
        <Image source={{ uri: program.coverImage }} style={styles.heroImg} />
      ) : (
        <View style={[styles.heroImg, { backgroundColor: '#1e293b' }]} />
      )}

      <Text style={styles.title}>{program?.title || 'Program'}</Text>
      <Text style={styles.uni}>
        {program?.universityName || 'University'} • {program?.location || 'South Africa'}
      </Text>

      <View style={styles.badgeRow}>
        <View style={styles.specBadge}>
          <Text style={styles.specText}>{program?.durationYears || 3} Years</Text>
        </View>
        <View style={styles.specBadge}>
          <Text style={styles.specText}>NQF Level {program?.nqfLevel || 7}</Text>
        </View>
        {program?.averageSalary && (
          <View style={styles.specBadge}>
            <Text style={styles.specText}>Salary: {program.averageSalary}</Text>
          </View>
        )}
      </View>

      <Text style={styles.desc}>{program?.description || 'No description provided.'}</Text>

      {program?.aiCareerInsight && (
        <View style={styles.insightBox}>
          <View style={styles.insightHeader}>
            <Lightbulb color="#60a5fa" size={18} />
            <Text style={styles.insightTitle}>Career Intelligence</Text>
          </View>
          <Text style={styles.insightText}>{program.aiCareerInsight}</Text>
        </View>
      )}

      <View style={styles.reqCard}>
        <Text style={styles.reqTitle}>Admission Thresholds</Text>
        <Text style={styles.reqSub}>Minimum NSC Subject Percentages:</Text>
        {requirements.length > 0 ? (
          requirements.map((r, i) => (
            <View key={i} style={styles.reqRow}>
              <CheckCircle2 color="#34d399" size={16} />
              <Text style={styles.reqSubject}>{r?.subject || 'Subject'}</Text>
              <Text style={styles.reqTarget}>{r?.requiredPercentage || 50}%</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: '#71717a', fontSize: 12 }}>Check official faculty prospectus.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.applyBtn} onPress={onStartApplication}>
        <Text style={styles.applyBtnText}>Start Pre-Application Checklist</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  headerTitle: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  heroImg: { width: '100%', height: 180, borderRadius: 16, marginBottom: 16 },
  title: { color: '#f4f4f5', fontSize: 22, fontWeight: 'bold' },
  uni: { color: '#a1a1aa', fontSize: 14, marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  specBadge: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  specText: { color: '#bfdbfe', fontSize: 11, fontWeight: '600' },
  desc: { color: '#d4d4d8', fontSize: 13, lineHeight: 20, marginVertical: 8 },
  insightBox: { backgroundColor: '#172554', padding: 16, borderRadius: 14, marginVertical: 12, borderWidth: 1, borderColor: '#1e3a8a' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  insightTitle: { color: '#60a5fa', fontWeight: 'bold', fontSize: 14 },
  insightText: { color: '#ffffff', fontSize: 12, lineHeight: 18 },
  reqCard: { backgroundColor: '#141416', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#27272a', marginVertical: 8 },
  reqTitle: { color: '#f4f4f5', fontWeight: 'bold', fontSize: 15 },
  reqSub: { color: '#71717a', fontSize: 12, marginBottom: 12, marginTop: 2 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  reqSubject: { color: '#d4d4d8', fontSize: 13, flex: 1 },
  reqTarget: { color: '#60a5fa', fontWeight: 'bold', fontSize: 13 },
  applyBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 14, marginBottom: 30 },
  applyBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
