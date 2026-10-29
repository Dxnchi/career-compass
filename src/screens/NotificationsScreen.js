import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';
import { DEADLINES_DATA } from '../data/dataStore';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

const { width } = Dimensions.get('window');

// Fun, bouncy card component
const NotificationCard = ({ deadline, index }) => {
  // Cycle through fun colors for the date badges
  const funColors = [
    { bg: '#FFF3E0', text: '#FF9800' }, // Orange
    { bg: '#E6F8F1', text: '#00A86B' }, // Green
    { bg: '#E8E0FF', text: '#6C47FF' }, // Purple
    { bg: '#FFE8E8', text: '#FF3B30' }, // Red
  ];
  const colorSet = funColors[index % funColors.length];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={[styles.dateBox, { backgroundColor: colorSet.bg }]}>
        <Text style={[styles.month, { color: colorSet.text }]}>
          {deadline?.month || 'DATE'}
        </Text>
        <Text style={[styles.day, { color: colorSet.text }]}>
          {deadline?.day || '--'}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{deadline?.title || 'Notice'}</Text>
        <Text style={styles.text} numberOfLines={2}>
          {deadline?.subtitle || 'Tap to view details.'}
        </Text>
      </View>

      <View style={styles.arrowCircle}>
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
};

export default function NotificationsScreen({
  deadlines = DEADLINES_DATA,
  onBack = () => {},
}) {
  const safeDeadlines = Array.isArray(deadlines) ? deadlines : DEADLINES_DATA;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Fun Background Shapes */}
      <View style={[styles.shape, styles.shapePurple]} />
      <View style={[styles.shape, styles.shapeYellow]} />

      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <ArrowLeft color={COLORS.textDark} size={24} />
          </TouchableOpacity>
        )}
        <Text style={styles.heading}>Notifications</Text>
        <View style={{ width: 40 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <Text style={styles.subtitle}>Don't miss these important application and funding dates! 📅</Text>

        {safeDeadlines.length > 0 ? (
          safeDeadlines.map((deadline, index) => (
            <NotificationCard 
              key={deadline?.id || index} 
              deadline={deadline} 
              index={index} 
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="notifications-off-outline" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyText}>You're all caught up! No new notifications.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, overflow: 'hidden' },
  
  // Fun Background Shapes
  shape: { position: 'absolute', borderRadius: 1000, opacity: 0.5 },
  shapePurple: { width: 250, height: 250, backgroundColor: '#E8E0FF', top: -80, right: -50 },
  shapeYellow: { width: 150, height: 150, backgroundColor: '#FFF3E0', bottom: 50, left: -50 },

  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding, paddingTop: 20, paddingBottom: 10,
    zIndex: 1 // Keeps header above background shapes
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.light
  },
  heading: { fontSize: SIZES.h2, fontWeight: '800', color: COLORS.textDark },
  
  subtitle: { 
    color: COLORS.textGray, fontSize: 14, fontWeight: '500',
    paddingHorizontal: SIZES.padding, marginTop: 10, marginBottom: 24,
    lineHeight: 20
  },

  // Fun Card
  card: { 
    backgroundColor: COLORS.white, borderRadius: 24, // Very rounded
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, 
    marginHorizontal: SIZES.padding, marginBottom: 16, ...SHADOWS.light 
  },
  
  dateBox: { 
    borderRadius: 16, paddingVertical: 12, alignItems: 'center', width: 64 
  },
  month: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  day: { fontSize: 24, fontWeight: '800', marginTop: 2 },
  
  content: { flex: 1 },
  title: { color: COLORS.textDark, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  text: { color: COLORS.textGray, fontSize: 13, lineHeight: 18 },

  arrowCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0EBFF',
    justifyContent: 'center', alignItems: 'center'
  },
  
  emptyCard: { 
    padding: 40, alignItems: 'center', backgroundColor: COLORS.white, 
    marginHorizontal: SIZES.padding, borderRadius: 24, ...SHADOWS.light 
  },
  emptyIconBg: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0EBFF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  emptyText: { color: COLORS.textGray, fontSize: 14, textAlign: 'center', fontWeight: '500' },
});