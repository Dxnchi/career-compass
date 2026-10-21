import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Animated } from 'react-native';
import { Scan, Bell, MapPin, Lightbulb } from 'lucide-react-native';
import AnimatedPressable from '../components/AnimatedPressable';

export default function HomeScreen({
  user = {},
  matches = [],
  deadlines = [],
  currentAps = 0,
  onNavigate = () => {},
  onSelectProgram = () => {},
}) {
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';
  const safeMatches = Array.isArray(matches) ? matches : [];
  const safeDeadlines = Array.isArray(deadlines) ? deadlines : [];

  // Card staggered entry animation
  const heroSlide = useRef(new Animated.Value(20)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(heroSlide, {
        toValue: 0,
        speed: 18,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>Career Compass</Text>
          <Text style={styles.brandSub}>South African Matric Pathways</Text>
        </View>
        <AnimatedPressable
          style={styles.bellBtn}
          onPress={() => onNavigate('notifications')}
        >
          <Bell color="#a1a1aa" size={20} />
          <View style={styles.unreadDot} />
        </AnimatedPressable>
      </View>

      {/* Hero Card */}
      <Animated.View
        style={[
          styles.heroCard,
          {
            opacity: heroOpacity,
            transform: [{ translateY: heroSlide }],
          },
        ]}
      >
        <Text style={styles.heroGreeting}>Hi {firstName}!</Text>
        <Text style={styles.heroText}>
          Your verified APS is <Text style={styles.boldAps}>{currentAps} Points</Text>. You qualify for direct entry into top tier programs.
        </Text>
        <AnimatedPressable
          style={styles.heroBtn}
          onPress={() => onNavigate('matches')}
        >
          <Lightbulb color="#1d4ed8" size={16} />
          <Text style={styles.heroBtnText}>View AI Recommendations</Text>
        </AnimatedPressable>
      </Animated.View>

      {/* Scan CTA */}
      <AnimatedPressable
        style={styles.scanCta}
        onPress={() => onNavigate('scan')}
      >
        <View style={styles.scanIconWrap}>
          <Scan color="#3b82f6" size={24} />
        </View>
        <Text style={styles.scanTitle}>Scan New Report Card</Text>
        <Text style={styles.scanSub}>
          Take a photo or upload grades to recalculate requirements.
        </Text>
      </AnimatedPressable>

      {/* Recommended Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Eligible Degrees</Text>
        <AnimatedPressable onPress={() => onNavigate('matches')}>
          <Text style={styles.sectionLink}>View all</Text>
        </AnimatedPressable>
      </View>

      {safeMatches.slice(0, 2).map((prog) => (
        <AnimatedPressable
          key={prog?.id || Math.random().toString()}
          style={styles.progCard}
          onPress={() => onSelectProgram(prog)}
        >
          {prog?.coverImage ? (
            <Image source={{ uri: prog.coverImage }} style={styles.progImage} />
          ) : (
            <View style={[styles.progImage, { backgroundColor: '#1e293b' }]} />
          )}
          <View style={styles.progCardBody}>
            <View style={styles.badgeRow}>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{prog?.matchScore || 0}% Match</Text>
              </View>
              <Text style={styles.reqAps}>APS: {prog?.requiredAps || '--'}</Text>
            </View>
            <Text style={styles.progTitle}>{prog?.title || 'Degree Program'}</Text>
            <Text style={styles.progUni}>{prog?.universityName || 'University'}</Text>
            <View style={styles.progFooter}>
              <View style={styles.locationWrap}>
                <MapPin color="#71717a" size={13} />
                <Text style={styles.locationText}>{prog?.location || 'South Africa'}</Text>
              </View>
              <Text style={styles.detailLink}>Details →</Text>
            </View>
          </View>
        </AnimatedPressable>
      ))}

      {/* Deadlines Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Key Admission Dates</Text>
      </View>
      <View style={styles.deadlineBox}>
        {safeDeadlines.map((item) => (
          <AnimatedPressable
            key={item?.id || Math.random().toString()}
            style={styles.deadlineRow}
            scaleTo={0.98}
            onPress={() => onNavigate('notifications')}
          >
            <View style={styles.dateBadge}>
              <Text style={styles.dateMonth}>{item?.month || 'DATE'}</Text>
              <Text style={styles.dateDay}>{item?.day || '--'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.deadlineTitle}>{item?.title || 'Notice'}</Text>
              <Text style={styles.deadlineSub}>{item?.subtitle || ''}</Text>
            </View>
          </AnimatedPressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  brandTitle: { color: '#f4f4f5', fontSize: 20, fontWeight: 'bold' },
  brandSub: { color: '#71717a', fontSize: 12 },
  bellBtn: { padding: 8, backgroundColor: '#141416', borderRadius: 20, position: 'relative' },
  unreadDot: { width: 8, height: 8, backgroundColor: '#3b82f6', borderRadius: 4, position: 'absolute', top: 6, right: 6 },
  heroCard: { backgroundColor: '#1e3a8a', padding: 20, borderRadius: 16, marginBottom: 16 },
  heroGreeting: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  heroText: { color: '#bfdbfe', fontSize: 13, marginTop: 6, lineHeight: 18 },
  boldAps: { color: '#ffffff', fontWeight: 'bold' },
  heroBtn: { backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 14, alignSelf: 'flex-start' },
  heroBtnText: { color: '#1d4ed8', fontWeight: 'bold', fontSize: 12 },
  scanCta: { backgroundColor: '#141416', padding: 18, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#27272a', marginBottom: 20 },
  scanIconWrap: { backgroundColor: '#1e293b', padding: 12, borderRadius: 12, marginBottom: 8 },
  scanTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  scanSub: { color: '#a1a1aa', fontSize: 12, marginTop: 4, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  sectionLink: { color: '#60a5fa', fontSize: 13, fontWeight: '600' },
  progCard: { backgroundColor: '#141416', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a', marginBottom: 14 },
  progImage: { width: '100%', height: 130 },
  progCardBody: { padding: 14 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  scoreBadge: { backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  scoreText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  reqAps: { color: '#a1a1aa', fontSize: 12 },
  progTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  progUni: { color: '#a1a1aa', fontSize: 12, marginTop: 2 },
  progFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#27272a' },
  locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { color: '#71717a', fontSize: 12 },
  detailLink: { color: '#60a5fa', fontSize: 12, fontWeight: '600' },
  deadlineBox: { backgroundColor: '#141416', borderRadius: 16, padding: 8, borderWidth: 1, borderColor: '#27272a' },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 12 },
  dateBadge: { backgroundColor: '#27272a', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, alignItems: 'center', width: 44 },
  dateMonth: { color: '#f87171', fontSize: 10, fontWeight: 'bold' },
  dateDay: { color: '#f4f4f5', fontSize: 14, fontWeight: 'bold' },
  deadlineTitle: { color: '#f4f4f5', fontSize: 13, fontWeight: '600' },
  deadlineSub: { color: '#71717a', fontSize: 11 },
});
