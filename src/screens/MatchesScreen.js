import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

// Fun colors for the university icons
const ICON_COLORS = [
  { bg: '#E8E0FF', icon: COLORS.primary },
  { bg: '#FFF3E0', icon: '#FF9800' },
  { bg: '#E6F8F1', icon: '#00A86B' },
  { bg: '#FFE8E8', icon: '#FF3B30' },
];

export default function MatchesScreen({ matches, onBack, onSelectProgram }) {
  const [activeTab, setActiveTab] = useState('All');

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Universities') return match.status === 'eligible' || match.status === 'close'; 
    if (activeTab === 'Degrees') return match.status === 'eligible';
    return true;
  });

  // Fun Badge Renderer
  const renderBadge = (status) => {
    if (status === 'eligible') {
      return (
        <View style={[styles.badge, { backgroundColor: COLORS.successBg }]}>
          <Ionicons name="sparkles" size={12} color={COLORS.successText} style={{ marginRight: 4 }} />
          <Text style={[styles.badgeText, { color: COLORS.successText }]}>HIGH MATCH</Text>
        </View>
      );
    } else if (status === 'close') {
      return (
        <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="trending-up" size={12} color="#FF9800" style={{ marginRight: 4 }} />
          <Text style={[styles.badgeText, { color: '#FF9800' }]}>POSSIBLE MATCH</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Fun Background Shapes */}
      <View style={[styles.shape, styles.shapePurple]} />
      <View style={[styles.shape, styles.shapeYellow]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Matches</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>
        We found these programs based on your APS score and interests.
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
        
        {filteredMatches.map((match, index) => {
          const colorSet = ICON_COLORS[index % ICON_COLORS.length];
          
          return (
            <TouchableOpacity 
              key={match.id || index} 
              style={styles.matchCard}
              activeOpacity={0.7}
              onPress={() => onSelectProgram(match)}
            >
              <View style={styles.matchHeader}>
                <View style={[styles.uniIconBg, { backgroundColor: colorSet.bg }]}>
                  <Ionicons name="school" size={24} color={colorSet.icon} />
                </View>
                <View style={styles.matchInfo}>
                  <Text style={styles.uniName}>{match.university || 'University Name'}</Text>
                  <Text style={styles.degreeName}>{match.name || 'Degree Name'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
              </View>

              <View style={styles.matchFooter}>
                {renderBadge(match.status)}
                
                {/* Fun APS / Match Score Pill */}
                <View style={styles.scorePill}>
                  <Text style={styles.scoreText}>
                    {match.matchScore ? `${match.matchScore}% Match` : `Req APS: ${match.requiredAps || '--'}`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredMatches.length === 0 && (
          <View style={styles.emptyBox}>
            <Ionicons name="search" size={40} color={COLORS.textGray} />
            <Text style={styles.emptyText}>No matches found for this category yet.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, overflow: 'hidden' },
  
  // Fun Background Shapes
  shape: { position: 'absolute', borderRadius: 1000, opacity: 0.4 },
  shapePurple: { width: 300, height: 300, backgroundColor: '#E8E0FF', top: -100, right: -100 },
  shapeYellow: { width: 200, height: 200, backgroundColor: '#FFF3E0', bottom: 100, left: -100 },

  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding, paddingTop: 20,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.light
  },
  headerTitle: { fontSize: SIZES.h2, fontWeight: '800', color: COLORS.textDark },
  
  subtitle: {
    fontSize: 14, color: COLORS.textGray, paddingHorizontal: SIZES.padding,
    marginTop: 16, marginBottom: 20, lineHeight: 20, fontWeight: '500'
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row', paddingHorizontal: SIZES.padding, marginBottom: 20, gap: 10
  },
  tab: {
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20,
    backgroundColor: COLORS.white, ...SHADOWS.light
  },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: COLORS.textGray },
  activeTabText: { color: COLORS.white },

  // Match Cards
  matchCard: {
    backgroundColor: COLORS.white, marginHorizontal: SIZES.padding, marginBottom: 16,
    padding: 20, borderRadius: 24, ...SHADOWS.light
  },
  matchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  uniIconBg: {
    width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  matchInfo: { flex: 1 },
  uniName: { fontSize: 12, color: COLORS.textGray, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  degreeName: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },

  matchFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 16,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12,
  },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  
  // Score Pill
  scorePill: {
    backgroundColor: '#F8F9FA', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border
  },
  scoreText: { fontSize: 12, fontWeight: '800', color: COLORS.primary },

  emptyBox: { padding: 40, alignItems: 'center', marginTop: 20 },
  emptyText: { color: COLORS.textGray, fontSize: 14, marginTop: 12, fontWeight: '500' },
});