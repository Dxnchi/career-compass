import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

// Reusable Card Component for the menu
const MenuCard = ({ icon, title, subtitle, iconColor, bgColor, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
  </TouchableOpacity>
);

export default function HomeScreen({ user, currentAps, onNavigate }) {
  // Fallback just in case user is null
  const displayName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {displayName} 👋</Text>
            <Text style={styles.subtitle}>Let's find your next step!</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn} onPress={() => onNavigate('notifications')}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>

        {/* APS Summary Card (Uses your currentAps logic) */}
        <View style={styles.apsCard}>
          <View>
            <Text style={styles.apsTitle}>Current APS Score</Text>
            <Text style={styles.apsScore}>{currentAps || 0}</Text>
          </View>
          <View style={styles.apsIconBg}>
            <Ionicons name="stats-chart" size={24} color={COLORS.primary} />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuCard 
            icon="scan-outline" 
            title="Scan Your Report Card" 
            subtitle="Let's read your grades and let us do the rest!" 
            iconColor={COLORS.primary}
            bgColor="#E8E0FF"
            onPress={() => onNavigate('scan')}
          />
          <MenuCard 
            icon="document-text-outline" 
            title="My Results & Matches" 
            subtitle="View your scanned grades and matches" 
            iconColor="#00A86B"
            bgColor="#D1F4FF"
            onPress={() => onNavigate('matches')}
          />
          <MenuCard 
            icon="school-outline" 
            title="University Database" 
            subtitle="Check admission rules and requirements" 
            iconColor="#FF9800"
            bgColor="#FFF3E0"
            onPress={() => onNavigate('explore')}
          />
          <MenuCard 
            icon="compass-outline" 
            title="Career Explorer" 
            subtitle="Discover careers based on your profile" 
            iconColor="#FF3B30"
            bgColor="#FFE8E8"
            onPress={() => onNavigate('explore')}
          />
        </View>

        {/* Quick Tips Card */}
        <View style={styles.tipContainer}>
          <View style={styles.tipIconBg}>
            <Ionicons name="bulb-outline" size={20} color={COLORS.accentYellow} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Quick Tips</Text>
            <Text style={styles.tipText}>
              Not sure what to choose? Explore popular career paths and see what fits your interests!
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: SIZES.padding, 
    paddingTop: 20,
    marginBottom: 20
  },
  greeting: { fontSize: SIZES.h2, fontWeight: '800', color: COLORS.textDark },
  subtitle: { fontSize: SIZES.body, color: COLORS.textGray, marginTop: 4 },
  notificationBtn: { 
    backgroundColor: COLORS.white, 
    padding: 10, 
    borderRadius: 50, 
    ...SHADOWS.light 
  },
  
  apsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    padding: 20,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.light
  },
  apsTitle: { fontSize: 14, color: COLORS.textGray, fontWeight: '600' },
  apsScore: { fontSize: 36, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
  apsIconBg: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0EBFF',
    justifyContent: 'center', alignItems: 'center'
  },

  menuContainer: { paddingHorizontal: SIZES.padding, gap: 12 },
  card: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: SIZES.radius,
    ...SHADOWS.light
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  cardSubtitle: { fontSize: 12, color: COLORS.textGray, marginTop: 4, lineHeight: 16 },

  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFBF0',
    marginHorizontal: SIZES.padding,
    marginTop: 24,
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: '#FFE8B2'
  },
  tipIconBg: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF3E0',
    justifyContent: 'center', alignItems: 'center'
  },
  tipTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  tipText: { fontSize: 12, color: COLORS.textGray, lineHeight: 18 }
});