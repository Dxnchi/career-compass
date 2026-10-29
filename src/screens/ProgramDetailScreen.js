// src/screens/ProgramDetailScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { ArrowLeft, Lightbulb, CheckCircle2, ExternalLink } from 'lucide-react-native';

// Curated Deep-Links for Direct SA Application Portals (Prevents homepage "doomscrolling")
const SA_DIRECT_APPLICATION_PORTALS = {
  'University of Johannesburg': 'https://www.uj.ac.za/admission-aid/undergraduate/',
  'University of the Witwatersrand': 'https://www.wits.ac.za/undergraduate/apply-to-wits/',
  'University of Pretoria': 'https://www.up.ac.za/online-application',
  'University of Cape Town': 'https://www.uct.ac.za/apply',
  'Stellenbosch University': 'https://www.sun.ac.za/english/maties/apply',
  'University of KwaZulu-Natal': 'https://caes.ukzn.ac.za/apply/',
  'Tshwane University of Technology': 'https://www.tut.ac.za/study-at-tut/i-want-to-study/apply',
  'University of South Africa': 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission',
  'North-West University': 'https://studies.nwu.ac.za/studies/apply',
  'University of the Western Cape': 'https://www.uwc.ac.za/admission-and-financial-aid/apply',
  'Rhodes University': 'https://www.ru.ac.za/admissiongateway/',
  'University of the Free State': 'https://apply.ufs.ac.za/',
  'Nelson Mandela University': 'https://www.mandela.ac.za/Study-at-Mandela/Application',
  'Cape Peninsula University of Technology': 'https://www.cput.ac.za/study/apply',
  'Durban University of Technology': 'https://www.dut.ac.za/student_portal/application_information/',
};

export default function ProgramDetailScreen({
  program = {},
  onBack = () => {},
  onStartApplication = () => {},
}) {
  const [apiLoading, setApiLoading] = useState(false);

  const requirements = Array.isArray(program?.admissionRequirements)
    ? program.admissionRequirements
    : [];

  const universityName = program?.universityName || 'University of Johannesburg';

  /**
   * 1. Queries the live Hipolabs University API strictly filtered to South Africa.
   * 2. Enforces a strict .ac.za academic domain check to block non-university results.
   * 3. Resolves to the direct application portal so students don't doomscroll the homepage.
   */
  const handleOfficialPortalRedirect = async () => {
    setApiLoading(true);
    try {
      const encodedUni = encodeURIComponent(universityName.trim());
      // Strictly filter API query by country=South+Africa
      const apiUrl = `http://universities.hipolabs.com/search?name=${encodedUni}&country=South+Africa`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`University API returned status ${response.status}`);
      }

      const data = await response.json();

      // Filter response strictly to official South African academic domains (.ac.za or .edu.za)
      const verifiedSaUni = data.find(
        (item) =>
          item.country === 'South Africa' &&
          Array.isArray(item.domains) &&
          item.domains.some((domain) => domain.endsWith('.ac.za') || domain.endsWith('.edu.za'))
      );

      // Determine final target URL:
      // Priority 1: Direct application sub-page (stops homepage doomscrolling)
      // Priority 2: Verified API homepage from the fetch() response
      let targetUrl = SA_DIRECT_APPLICATION_PORTALS[universityName];

      if (!targetUrl && verifiedSaUni && verifiedSaUni.web_pages?.length > 0) {
        targetUrl = verifiedSaUni.web_pages[0];
      }

      if (!targetUrl) {
        Alert.alert(
          'Restricted Portal',
          `Could not verify an accredited South African (.ac.za) portal for "${universityName}".`
        );
        return;
      }

      // Upgrade plain http:// from API to https:// for secure mobile browser handoff
      const secureUrl = targetUrl.replace(/^http:\/\//i, 'https://');

      const canOpen = await Linking.canOpenURL(secureUrl);
      if (canOpen) {
        await Linking.openURL(secureUrl);
      } else {
        Alert.alert('Navigation Error', `Unable to launch URL: ${secureUrl}`);
      }
    } catch (error) {
      console.warn('[API Fallback Triggered]:', error.message);
      // Graceful Fallback: If mobile network blocks plain HTTP, use verified SA dictionary
      const fallbackUrl = SA_DIRECT_APPLICATION_PORTALS[universityName];
      if (fallbackUrl) {
        await Linking.openURL(fallbackUrl);
      } else {
        Alert.alert(
          'Connection Error',
          'Could not reach the University Directory API. Please check your connection.'
        );
      }
    } finally {
      setApiLoading(false);
    }
  };

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
        {universityName} • {program?.location || 'South Africa'}
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

      {/* Existing Checklist Modal Trigger */}
      <TouchableOpacity style={styles.applyBtn} onPress={onStartApplication}>
        <Text style={styles.applyBtnText}>Start Pre-Application Checklist</Text>
      </TouchableOpacity>

      {/* New API-Driven Official SA University Portal Redirect */}
      <TouchableOpacity
        style={[styles.portalBtn, apiLoading && { opacity: 0.7 }]}
        onPress={handleOfficialPortalRedirect}
        disabled={apiLoading}
      >
        {apiLoading ? (
          <ActivityIndicator color="#60a5fa" size="small" />
        ) : (
          <View style={styles.portalBtnContent}>
            <Text style={styles.portalBtnText}>Apply on Official SA University Portal</Text>
            <ExternalLink color="#60a5fa" size={16} />
          </View>
        )}
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
  insightBox: {
    backgroundColor: '#172554',
    padding: 16,
    borderRadius: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#1e3a8a',
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  insightTitle: { color: '#60a5fa', fontWeight: 'bold', fontSize: 14 },
  insightText: { color: '#ffffff', fontSize: 12, lineHeight: 18 },
  reqCard: {
    backgroundColor: '#141416',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#27272a',
    marginVertical: 8,
  },
  reqTitle: { color: '#f4f4f5', fontWeight: 'bold', fontSize: 15 },
  reqSub: { color: '#71717a', fontSize: 12, marginBottom: 12, marginTop: 2 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  reqSubject: { color: '#d4d4d8', fontSize: 13, flex: 1 },
  reqTarget: { color: '#60a5fa', fontWeight: 'bold', fontSize: 13 },
  applyBtn: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  applyBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  portalBtn: {
    backgroundColor: '#172554',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  portalBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  portalBtnText: {
    color: '#60a5fa',
    fontWeight: 'bold',
    fontSize: 15,
  },
});