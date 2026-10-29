import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

export default function MatchesScreen({ matches, onBack, onSelectProgram }) {
  const [activeTab, setActiveTab] = useState('All');

  // Filter matches based on the tab selected
  const filteredMatches = matches.filter(match => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Universities') return match.status === 'eligible' || match.status === 'close'; 
    // We'll treat 'eligible' as Degrees for now, adjust based on your data structure
    if (activeTab === 'Degrees') return match.status === 'eligible';
    return true;
  });

  // Helper to render the correct badge based on your App.js logic
  const renderBadge = (status) => {
    if (status === 'eligible') {
      return (
        <View style={[styles.badge, { backgroundColor: COLORS.successBg }]}>
          <Text style={[styles.badgeText, { color: COLORS.successText }]}>HIGH MATCH</Text>
        </View>
      );
    } else if (status === 'close') {
      return (
        <View style={[styles.badge, { backgroundColor: COLORS.warningBg }]}>
          <Text style={[styles.badgeText, { color: COLORS.warningText }]}>POSSIBLE MATCH</Text>
        </View>
      );
    }
    return null; // Don't show a badge if not eligible
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your University Matches</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <Text style={styles.subtitle}>
        Based on your grades, here are the universities and programs you qualify for.
      </Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['All', 'Universities', 'Degrees'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Matches List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {filteredMatches.map((match, index) => (
          <TouchableOpacity 
            key={match.id || index} 
            style={styles.matchCard}
            activeOpacity={0.7}
            onPress={() => onSelectProgram(match)}
          >
            <View style={styles.matchHeader}>
              <View style={styles.uniIconBg}>
                <Ionicons name="school" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.matchInfo}>
                <Text style={styles.uniName}>{match.university || 'University Name'}</Text>
                <Text style={styles.degreeName}>{match.name || 'Degree Name'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
            </View>

            <View style={styles.matchFooter}>
              {renderBadge(match.status)}
              <Text style={styles.apsReqText}>
                Minimum APS: {match.requiredAps || 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredMatches.length === 0 && (
          <Text style={styles.emptyText}>No matches found for this category.</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
  },
  backBtn: {
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    ...SHADOWS.light
  },
  headerTitle: { fontSize: SIZES.h3, fontWeight: '700', color: COLORS.textDark },
  subtitle: {
    fontSize: 13,
    color: COLORS.textGray,
    paddingHorizontal: SIZES.padding,
    marginTop: 16,
    marginBottom: 20,
    lineHeight: 18
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 10,
    ...SHADOWS.light
  },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textGray },
  activeTabText: { color: COLORS.white },

  // Cards
  matchCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    marginBottom: 16,
    padding: 16,
    borderRadius: SIZES.radius,
    ...SHADOWS.light
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  uniIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0EBFF', // Light purple
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  matchInfo: { flex: 1 },
  uniName: { fontSize: 12, color: COLORS.textGray, fontWeight: '600', marginBottom: 4 },
  degreeName: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },

  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  apsReqText: {
    fontSize: 12,
    color: COLORS.textGray,
    fontWeight: '500'
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textGray,
    marginTop: 40,
    fontSize: 14
  }
});