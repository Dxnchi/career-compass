// src/screens/ProgramDetailScreen.js
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Lightbulb, CheckCircle2, XCircle, Award } from 'lucide-react-native';

export default function ProgramDetailScreen({
  program = {},
  onBack = () => {},
  onStartApplication = () => {},
}) {
  const passedReqs = Array.isArray(program?.passedRequirements) ? program.passedRequirements : [];
  const missingReqs = Array.isArray(program?.missingRequirements) ? program.missingRequirements : [];
  
  const rawRequirements = Array.isArray(program?.programme_requirements)
    ? program.programme_requirements
    : Array.isArray(program?.admissionRequirements)
    ? program.admissionRequirements
    : [];

  const studentAps = program?.studentAps || 0;
  const requiredAps = program?.requiredAps || program?.minAPS || 0;
  const isApsMet = studentAps >= requiredAps;

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

      <Text style={styles.title}>{program?.title || program?.name || 'Program'}</Text>
      <Text style={styles.uni}>
        {program?.universityName || 'South African University'}
        {program?.location ? ` • ${program.location}` : ''}
        {program?.faculty ? ` • ${program.faculty}` : ''}
      </Text>

      {/* APS Comparison Card */}
      <View style={styles.apsCard}>
        <View style={styles.apsItem}>
          <Text style={styles.apsHeader}>Required APS</Text>
          <Text style={styles.apsNumber}>{requiredAps || '--'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.apsItem}>
          <Text style={styles.apsHeader}>Your APS</Text>
          <Text style={[styles.apsNumber, { color: isApsMet ? '#34d399' : '#f87171' }]}>
            {studentAps || '--'}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.apsItem}>
          <Text style={styles.apsHeader}>Status</Text>
          <Text style={[styles.statusTag, { color: isApsMet ? '#34d399' : '#f87171' }]}>
            {isApsMet ? 'APS Met' : 'Below Target'}
          </Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.specBadge}>
          <Text style={styles.specText}>{program?.durationYears || 3} Years</Text>
        </View>
        <View style={styles.specBadge}>
          <Text style={styles.specText}>NQF Level {program?.nqfLevel || 7}</Text>
        </View>
        {program?.matchScore !== undefined && (
          <View style={[styles.specBadge, { backgroundColor: '#064e3b' }]}>
            <Award color="#34d399" size={12} />
            <Text style={[styles.specText, { color: '#34d399' }]}>
              {program.matchScore}% Match
            </Text>
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

      {/* Prerequisite Breakdown */}
      <View style={styles.reqCard}>
        <Text style={styles.reqTitle}>Admission Thresholds</Text>
        <Text style={styles.reqSub}>Required NSC Subject Levels vs Your Marks:</Text>

        {passedReqs.length > 0 || missingReqs.length > 0 ? (
          <>
            {passedReqs.map((r, i) => (
              <View key={`passed-${i}`} style={styles.reqRow}>
                <CheckCircle2 color="#34d399" size={16} />
                <Text style={styles.reqSubject}>{r.subject}</Text>
                <Text style={styles.reqAchieved}>
                  You: Lvl {r.achieved} <Text style={styles.reqTarget}>(Req L{r.required})</Text>
                </Text>
              </View>
            ))}

            {missingReqs.map((r, i) => (
              <View key={`missing-${i}`} style={styles.reqRow}>
                <XCircle color="#f87171" size={16} />
                <Text style={[styles.reqSubject, { color: '#f87171' }]}>{r.subject}</Text>
                <Text style={[styles.reqAchieved, { color: '#f87171' }]}>
                  {r.achieved ? `You: Lvl ${r.achieved}` : 'Not Taken'} <Text style={{ color: '#ef4444' }}>(Req L{r.required})</Text>
                </Text>
              </View>
            ))}
          </>
        ) : rawRequirements.length > 0 ? (
          rawRequirements.map((r, i) => (
            <View key={i} style={styles.reqRow}>
              <CheckCircle2 color="#60a5fa" size={16} />
              <Text style={styles.reqSubject}>{r?.subject_name || r?.subject || 'Subject'}</Text>
              <Text style={styles.reqTarget}>Lvl {r?.min_level || r?.requiredPercentage || 4}</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: '#71717a', fontSize: 12 }}>Check official faculty prospectus for prerequisite breakdown.</Text>
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
  apsCard: { flexDirection: 'row', backgroundColor: '#141416', borderRadius: 14, padding: 12, marginVertical: 12, borderWidth: 1, borderColor: '#27272a', justifyContent: 'space-around', alignItems: 'center' },
  apsItem: { alignItems: 'center' },
  apsHeader: { color: '#71717a', fontSize: 11, marginBottom: 4 },
  apsNumber: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  statusTag: { fontSize: 12, fontWeight: 'bold' },
  divider: { width: 1, height: 30, backgroundColor: '#27272a' },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  specBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  specText: { color: '#bfdbfe', fontSize: 11, fontWeight: '600' },
  desc: { color: '#d4d4d8', fontSize: 13, lineHeight: 20, marginVertical: 8 },
  insightBox: { backgroundColor: '#172554', padding: 16, borderRadius: 14, marginVertical: 12, borderWidth: 1, borderColor: '#1e3a8a' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  insightTitle: { color: '#60a5fa', fontWeight: 'bold', fontSize: 14 },
  insightText: { color: '#ffffff', fontSize: 12, lineHeight: 18 },
  reqCard: { backgroundColor: '#141416', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#27272a', marginVertical: 8 },
  reqTitle: { color: '#f4f4f5', fontWeight: 'bold', fontSize: 15 },
  reqSub: { color: '#71717a', fontSize: 12, marginBottom: 12, marginTop: 2 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#1c1c20' },
  reqSubject: { color: '#d4d4d8', fontSize: 13, flex: 1 },
  reqAchieved: { color: '#a1a1aa', fontSize: 12, fontWeight: '600' },
  reqTarget: { color: '#60a5fa', fontWeight: 'bold' },
  applyBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 14, marginBottom: 30 },
  applyBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
