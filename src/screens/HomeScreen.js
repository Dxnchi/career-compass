import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Animated, Platform, Linking, Dimensions } from 'react-native';
import { Scan, Bell, MapPin, Lightbulb, CheckCircle2, ExternalLink, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedPressable from '../components/AnimatedPressable';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
const { width } = Dimensions.get('window');

const TOP_10_UNIVERSITIES = [
  {
    id: 'uct',
    name: 'University of Cape Town',
    location: 'Rondebosch, Western Cape',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://www.uct.ac.za/main/prospectus',
  },
  {
    id: 'wits',
    name: 'University of the Witwatersrand',
    location: 'Braamfontein, Gauteng',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://www.wits.ac.za/course-finder/',
  },
  {
    id: 'sun',
    name: 'Stellenbosch University',
    location: 'Stellenbosch, Western Cape',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://www.sun.ac.za/english/maties/enquier-now/undergraduate-prospectus',
  },
  {
    id: 'up',
    name: 'University of Pretoria',
    location: 'Pretoria, Gauteng',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://www.up.ac.za/yearbooks/home',
  },
  {
    id: 'uj',
    name: 'University of Johannesburg',
    location: 'Auckland Park, Gauteng',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://www.uj.ac.za/admissions-aid/undergraduate-prospectus/',
  },
  {
    id: 'ukzn',
    name: 'Univ. of KwaZulu-Natal',
    location: 'Durban / Pietermaritzburg, KZN',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://applications.ukzn.ac.za/undergraduate-prospectus/',
  },
  {
    id: 'nwu',
    name: 'North-West University',
    location: 'Potchefstroom / Mahikeng',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://www.nwu.ac.za/undergraduate-prospectus',
  },
  {
    id: 'rhodes',
    name: 'Rhodes University',
    location: 'Makhanda, Eastern Cape',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://www.ru.ac.za/media/rhodesuniversity/content/registrar/documents/information/studentrecruitment/RU_READY_Undergraduate_Prospectus_2026_DIGITAL_A5_Landscape_24pp_18Mar2026.pdf',
  },
  {
    id: 'uwc',
    name: 'Univ. of the Western Cape',
    location: 'Bellville, Western Cape',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://www.uwc.ac.za/study/all-courses',
  },
  {
    id: 'nmu',
    name: 'Nelson Mandela University',
    location: 'Gqeberha, Eastern Cape',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    prospectusUrl: 'https://www.mandela.ac.za/Study-at-Mandela/Application/Undergraduate-Prospectus',
  },
];

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

  const topEligibleMatches = safeMatches
    .filter((p) => p?.status === 'DIRECT_MATCH' || p?.status === 'eligible')
    .slice(0, 2);

  const displayedMatches = topEligibleMatches.length > 0
    ? topEligibleMatches
    : safeMatches.slice(0, 2);

  const heroSlide = useRef(new Animated.Value(20)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.spring(heroSlide, {
        toValue: 0,
        speed: 18,
        bounciness: 6,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]).start();
  }, []);

  const openProspectus = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.warn('Could not open prospectus link:', e);
    }
  };

  const getHeroSubtitle = () => {
    if (currentAps === 0) {
      return 'Scan your Grade 11 or Matric statement to calculate your official university APS and discover matching degree programmes.';
    }
    if (currentAps >= 35) {
      return `Your verified APS is ${currentAps} Points. You qualify for direct entry into competitive programmes across top South African universities.`;
    }
    if (currentAps >= 28) {
      return `Your verified APS is ${currentAps} Points. You have strong degree options across Commerce, Science, and Humanities faculties.`;
    }
    return `Your verified APS is ${currentAps} Points. Explore tailored degree pathways and Extended Curriculum Programmes (ECP).`;
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
          {currentAps > 0 ? (
            <>
              Your verified APS is <Text style={styles.boldAps}>{currentAps} Points</Text>. {getHeroSubtitle().replace(`Your verified APS is ${currentAps} Points. `, '')}
            </>
          ) : (
            getHeroSubtitle()
          )}
        </Text>
        <AnimatedPressable
          style={styles.heroBtn}
          onPress={() => onNavigate('matches')}
        >
          <Lightbulb color="#ffffff" size={16} />
          <Text style={styles.heroBtnText}>View AI Recommendations</Text>
        </AnimatedPressable>
      </Animated.View>

      <AnimatedPressable
        style={styles.scanCta}
        onPress={() => onNavigate('scan')}
      >
        <View style={styles.scanIconWrap}>
          <Scan color="#3b82f6" size={24} />
        </View>
        <Text style={styles.scanTitle}>Scan Report Card</Text>
        <Text style={styles.scanSub}>
          Snap a photo of your NSC statement to extract grades and match university criteria.
        </Text>
      </AnimatedPressable>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <BookOpen color="#3b82f6" size={18} />
          <Text style={styles.sectionTitle}>Top 10 SA Universities & Prospectuses</Text>
        </View>
        <AnimatedPressable onPress={() => onNavigate('explore')}>
          <Text style={styles.sectionLink}>View All</Text>
        </AnimatedPressable>
      </View>
      <Text style={styles.sectionDesc}>Explore official prospectuses and admission guidelines.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.uniScrollContainer}>
        {TOP_10_UNIVERSITIES.map((uni) => (
          <AnimatedPressable
            key={uni.id}
            style={styles.uniCard}
            onPress={() => openProspectus(uni.prospectusUrl)}
          >
            <Image source={{ uri: uni.image }} style={styles.uniImage} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              style={styles.uniOverlay}
            />
            <View style={styles.uniContent}>
              <Text style={styles.uniName} numberOfLines={2}>{uni.name}</Text>
              <Text style={styles.uniLocation} numberOfLines={1}>{uni.location}</Text>
              <View style={styles.prospectusLinkRow}>
                <Text style={styles.prospectusLinkText}>Prospectus</Text>
                <ExternalLink color="#60a5fa" size={12} />
              </View>
            </View>
          </AnimatedPressable>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {topEligibleMatches.length > 0 ? 'Top Eligible Degrees' : 'Recommended Degrees'}
        </Text>
        <AnimatedPressable onPress={() => onNavigate('matches')}>
          <Text style={styles.sectionLink}>View all</Text>
        </AnimatedPressable>
      </View>

      {displayedMatches.length === 0 ? (
        <View style={styles.emptyMatchesBox}>
          <Text style={styles.emptyTitle}>No matches calculated yet</Text>
          <Text style={styles.emptySub}>Scan your high school report card or enter marks to unlock personalized university matches.</Text>
          <AnimatedPressable style={styles.emptyActionBtn} onPress={() => onNavigate('scan')}>
            <Text style={styles.emptyActionText}>Scan Report Card</Text>
          </AnimatedPressable>
        </View>
      ) : (
        displayedMatches.map((prog, index) => {
          const isDirect = prog?.status === 'DIRECT_MATCH' || prog?.status === 'eligible';
          const progTitle = prog?.title || prog?.name || 'Degree Programme';
          const requiredAps = prog?.requiredAps || prog?.min_aps || '--';

          return (
            <AnimatedPressable
              key={prog?.id || `${progTitle}-${index}`}
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
                  <View style={[styles.scoreBadge, !isDirect && { backgroundColor: '#374151' }]}>
                    {isDirect && <CheckCircle2 color="#34d399" size={11} style={{ marginRight: 3 }} />}
                    <Text style={[styles.scoreText, !isDirect && { color: '#d1d5db' }]}>
                      {prog?.matchScore || 0}% {isDirect ? 'Eligible' : 'Match'}
                    </Text>
                  </View>
                  <Text style={styles.reqAps}>Req APS: {requiredAps}</Text>
                </View>

                <Text style={styles.progTitle}>{progTitle}</Text>
                <Text style={styles.progUni}>
                  {prog?.universityName || 'South African University'}
                  {prog?.faculty ? ` • ${prog.faculty}` : ''}
                </Text>

                <View style={styles.progFooter}>
                  <View style={styles.locationWrap}>
                    <MapPin color="#71717a" size={13} />
                    <Text style={styles.locationText}>{prog?.location || 'South Africa'}</Text>
                  </View>
                  <Text style={styles.detailLink}>Details →</Text>
                </View>
              </View>
            </AnimatedPressable>
          );
        })
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Key Admission Dates</Text>
      </View>
      <View style={styles.deadlineBox}>
        {safeDeadlines.map((item, index) => (
          <AnimatedPressable
            key={item?.id || `deadline-${index}`}
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
  
  heroCard: { 
    backgroundColor: '#141416', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  heroGreeting: { color: '#f4f4f5', fontSize: 22, fontWeight: 'bold' },
  heroText: { color: '#a1a1aa', fontSize: 13, marginTop: 6, lineHeight: 18 },
  boldAps: { color: '#60a5fa', fontWeight: 'bold' },
  heroBtn: { 
    backgroundColor: '#2563eb', 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginTop: 16, 
    alignSelf: 'flex-start' 
  },
  heroBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },

  scanCta: { backgroundColor: '#141416', padding: 18, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#27272a', marginBottom: 20 },
  scanIconWrap: { backgroundColor: '#1e293b', padding: 12, borderRadius: 12, marginBottom: 8 },
  scanTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  scanSub: { color: '#a1a1aa', fontSize: 12, marginTop: 4, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  sectionLink: { color: '#60a5fa', fontSize: 13, fontWeight: '600' },
  sectionDesc: { color: '#a1a1aa', fontSize: 12, marginTop: -8, marginBottom: 12 },
  uniScrollContainer: { gap: 12, paddingBottom: 16 },
  uniCard: { width: 150, height: 195, borderRadius: 14, overflow: 'hidden', backgroundColor: '#141416', borderWidth: 1, borderColor: '#27272a', position: 'relative', justifyContent: 'flex-end' },
  uniImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  uniOverlay: { ...StyleSheet.absoluteFillObject },
  uniContent: { padding: 10, gap: 3, zIndex: 2 },
  uniName: { color: '#f4f4f5', fontSize: 12, fontWeight: 'bold', lineHeight: 16 },
  uniLocation: { color: '#a1a1aa', fontSize: 9 },
  prospectusLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  prospectusLinkText: { color: '#60a5fa', fontSize: 10, fontWeight: '700' },
  progCard: { backgroundColor: '#141416', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a', marginBottom: 14 },
  progImage: { width: '100%', height: 130 },
  progCardBody: { padding: 14 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  scoreText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  reqAps: { color: '#a1a1aa', fontSize: 12 },
  progTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  progUni: { color: '#a1a1aa', fontSize: 12, marginTop: 2 },
  progFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#27272a' },
  locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { color: '#71717a', fontSize: 12 },
  detailLink: { color: '#60a5fa', fontSize: 12, fontWeight: '600' },
  emptyMatchesBox: { backgroundColor: '#141416', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#27272a', gap: 8, marginBottom: 14 },
  emptyTitle: { color: '#f4f4f5', fontSize: 15, fontWeight: 'bold' },
  emptySub: { color: '#a1a1aa', fontSize: 12, textAlign: 'center', lineHeight: 17 },
  emptyActionBtn: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginTop: 4 },
  emptyActionText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  deadlineBox: { backgroundColor: '#141416', borderRadius: 16, padding: 8, borderWidth: 1, borderColor: '#27272a' },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 12 },
  dateBadge: { backgroundColor: '#27272a', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, alignItems: 'center', width: 44 },
  dateMonth: { color: '#f87171', fontSize: 10, fontWeight: 'bold' },
  dateDay: { color: '#f4f4f5', fontSize: 14, fontWeight: 'bold' },
  deadlineTitle: { color: '#f4f4f5', fontSize: 13, fontWeight: '600' },
  deadlineSub: { color: '#71717a', fontSize: 11 },
});
