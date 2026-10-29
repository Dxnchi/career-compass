// src/screens/ProgramDetailScreen.js
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { ArrowLeft, Lightbulb, CheckCircle2, XCircle, Award, School } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

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
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <ArrowLeft color={COLORS.textDark} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Degree Overview</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <View style={styles.uniRow}>
            <View style={styles.uniIconBg}>
              <School color={COLORS.primary} size={28} />
            </View>
            <Text style={styles.uniName}>
              {program?.universityName || 'South African University'}
            </Text>
          </View>

          <Text style={styles.title}>{program?.title || program?.name || 'Program'}</Text>
          <Text style={styles.uni}>
            {program?.location ? `${program.location} • ` : ''}
            {program?.faculty || 'Faculty'}
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
              <Text style={[styles.apsNumber, { color: isApsMet ? COLORS.successText : '#ef4444' }]}>
                {studentAps || '--'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.apsItem}>
              <Text style={styles.apsHeader}>Status</Text>
              <Text style={[styles.statusTag, { color: isApsMet ? COLORS.successText : '#ef4444' }]}>
                {isApsMet ? 'APS Met' : 'Below Target'}
              </Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.specBadge}>
            <Text style={styles.specText}>{program?.durationYears || 3} Years</Text>
          </View>
          <View style={styles.specBadge}>
            <Text style={styles.specText}>NQF Level {program?.nqfLevel || 7}</Text>
          </View>
          {program?.matchScore !== undefined && (
            <View style={[styles.specBadge, { backgroundColor: COLORS.successBg }]}>
              <Award color={COLORS.successText} size={14} />
              <Text style={[styles.specText, { color: COLORS.successText }]}>
                {program.matchScore}% Match
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Degree</Text>
          <Text style={styles.desc}>{program?.description || 'No description provided.'}</Text>
        </View>

        {/* AI Insight */}
        {program?.aiCareerInsight && (
          <View style={styles.insightBox}>
            <View style={styles.insightHeader}>
              <Lightbulb color={COLORS.primary} size={18} />
              <Text style={styles.insightTitle}>Career Intelligence</Text>
            </View>
            <Text style={styles.insightText}>{program.aiCareerInsight}</Text>
          </View>
        )}

        {/* Prerequisite Breakdown */}
        <View style={styles.reqCard}>
          <Text style={styles.sectionTitle}>Admission Thresholds</Text>
          <Text style={styles.reqSub}>Required NSC Subject Levels vs Your Marks:</Text>

          {passedReqs.length > 0 || missingReqs.length > 0 ? (
            <>
              {passedReqs.map((r, i) => (
                <View key={`passed-${i}`} style={styles.reqRow}>
                  <CheckCircle2 color={COLORS.successText} size={18} />
                  <Text style={styles.reqSubject}>{r.subject}</Text>
                  <Text style={styles.reqAchieved}>
                    You: Lvl {r.achieved} <Text style={styles.reqTarget}>(Req L{r.required})</Text>
                  </Text>
                </View>
              ))}

              {missingReqs.map((r, i) => (
                <View key={`missing-${i}`} style={styles.reqRow}>
                  <XCircle color="#ef4444" size={18} />
                  <Text style={[styles.reqSubject, { color: '#ef4444' }]}>{r.subject}</Text>
                  <Text style={[styles.reqAchieved, { color: '#ef4444' }]}>
                    {r.achieved ? `You: Lvl ${r.achieved}` : 'Not Taken'} <Text style={{ color: '#ef4444' }}>(Req L{r.required})</Text>
                  </Text>
                </View>
              ))}
            </>
          ) : rawRequirements.length > 0 ? (
            rawRequirements.map((r, i) => (
              <View key={i} style={styles.reqRow}>
                <CheckCircle2 color={COLORS.textGray} size={18} />
                <Text style={styles.reqSubject}>{r?.subject_name || r?.subject || 'Subject'}</Text>
                <Text style={styles.reqTarget}>Lvl {r?.min_level || r?.requiredPercentage || 4}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: COLORS.textGray, fontSize: 12 }}>Check official prospectus for requirements.</Text>
          )}
        </View>

      </ScrollView>

      {/* Apply Button Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyBtn} onPress={onStartApplication}>
          <Text style={styles.applyBtnText}>Start Application</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingTop: 20, paddingBottom: 10
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.light
  },
  headerTitle: { fontSize: SIZES.h3, fontWeight: '700', color: COLORS.textDark },

  mainCard: {
    backgroundColor: COLORS.white, marginHorizontal: SIZES.padding,
    padding: 20, borderRadius: SIZES.radius, marginTop: 16, ...SHADOWS.light
  },
  uniRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  uniIconBg: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: '#F0EBFF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  uniName: { fontSize: 14, fontWeight: '600', color: COLORS.textGray },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  uni: { fontSize: 13, color: COLORS.textGray, marginBottom: 20 },

  apsCard: { 
    flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 12, 
    padding: 16, justifyContent: 'space-around', alignItems: 'center' 
  },
  apsItem: { alignItems: 'center' },
  apsHeader: { color: COLORS.textGray, fontSize: 12, marginBottom: 4 },
  apsNumber: { color: COLORS.textDark, fontSize: 20, fontWeight: '800' },
  statusTag: { fontSize: 13, fontWeight: '700' },
  divider: { width: 1, height: 30, backgroundColor: COLORS.border },

  badgeRow: { flexDirection: 'row', gap: 8, paddingHorizontal: SIZES.padding, marginTop: 16 },
  specBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, ...SHADOWS.light },
  specText: { color: COLORS.textDark, fontSize: 12, fontWeight: '600' },

  section: { paddingHorizontal: SIZES.padding, marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  desc: { color: COLORS.textGray, fontSize: 14, lineHeight: 22 },

  insightBox: { 
    backgroundColor: '#F0EBFF', marginHorizontal: SIZES.padding, padding: 16, 
    borderRadius: SIZES.radius, marginTop: 24 
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  insightTitle: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  insightText: { color: COLORS.textDark, fontSize: 13, lineHeight: 20 },

  reqCard: { 
    backgroundColor: COLORS.white, marginHorizontal: SIZES.padding, 
    padding: 20, borderRadius: SIZES.radius, marginTop: 24, ...SHADOWS.light 
  },
  reqSub: { color: COLORS.textGray, fontSize: 12, marginBottom: 16 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  reqSubject: { color: COLORS.textDark, fontSize: 14, flex: 1, fontWeight: '500' },
  reqAchieved: { color: COLORS.textGray, fontSize: 12, fontWeight: '600' },
  reqTarget: { color: COLORS.primary, fontWeight: '700' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, padding: SIZES.padding, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  applyBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: SIZES.radius, alignItems: 'center', ...SHADOWS.light },
  applyBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});