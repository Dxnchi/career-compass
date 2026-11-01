// src/screens/ExploreScreen.js
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, TextInput, Linking } from 'react-native';
import { Search, MapPin, ExternalLink, Award, Calendar, BookOpen, ArrowLeft } from 'lucide-react-native';

const ALL_TOP_10_UNIVERSITIES = [
  {
    id: 'uct',
    code: 'UCT',
    name: 'University of Cape Town',
    location: 'Rondebosch, Western Cape',
    province: 'Western Cape',
    ranking: 1,
    closeDate: '31 Jul',
    portalUrl: 'https://applyonline.uct.ac.za/',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    description: 'Top-ranked African university offering prestigious faculties across all academic disciplines with world-class research infrastructure.',
  },
  {
    id: 'wits',
    code: 'WITS',
    name: 'University of the Witwatersrand',
    location: 'Braamfontein, Gauteng',
    province: 'Gauteng',
    ranking: 2,
    closeDate: '30 Sep',
    portalUrl: 'https://www.wits.ac.za/undergraduate/apply-to-wits/',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'World-class research institution leading in Medicine, Mining, Commerce, Engineering, and Law in the heart of Johannesburg.',
  },
  {
    id: 'sun',
    code: 'SUN',
    name: 'Stellenbosch University',
    location: 'Stellenbosch, Western Cape',
    province: 'Western Cape',
    ranking: 3,
    closeDate: '31 Aug',
    portalUrl: 'https://www.sun.ac.za/english/maties/enquier-now/undergraduate-prospectus',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: 'Renowned for academic excellence in Agri-Sciences, Engineering, Law, Theology, and Business Management.',
  },
  {
    id: 'up',
    code: 'UP',
    name: 'University of Pretoria',
    location: 'Pretoria, Gauteng',
    province: 'Gauteng',
    ranking: 4,
    closeDate: '31 Aug',
    portalUrl: 'https://www.up.ac.za/online-application',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
    description: 'Leader in Engineering (EBIT), Veterinary Science at Onderstepoort, Law, Health Sciences, and Economic Management Sciences.',
  },
  {
    id: 'uj',
    code: 'UJ',
    name: 'University of Johannesburg',
    location: 'Auckland Park, Gauteng',
    province: 'Gauteng',
    ranking: 5,
    closeDate: '30 Sep',
    portalUrl: 'https://www.uj.ac.za/admissions-aid/apply/',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Dynamic, inclusive and fast-growing institution renowned for 4IR integration, Computing, Accounting, and Applied Sciences.',
  },
  {
    id: 'ukzn',
    code: 'UKZN',
    name: 'Univ. of KwaZulu-Natal',
    location: 'Durban / Pietermaritzburg, KZN',
    province: 'KwaZulu-Natal',
    ranking: 6,
    closeDate: '30 Sep',
    portalUrl: 'https://studyatukzn.ukzn.ac.za/',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'A truly South African university committed to academic excellence, medical research, agriculture, and community engagement.',
  },
  {
    id: 'nwu',
    code: 'NWU',
    name: 'North-West University',
    location: 'Potchefstroom / Mahikeng',
    province: 'North West',
    ranking: 7,
    closeDate: '31 Aug',
    portalUrl: 'http://studies.nwu.ac.za/undergraduate-studies/application',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Multi-campus university excelling in Pharmacy, Education, Engineering, Natural Sciences, and Economic Sciences.',
  },
  {
    id: 'rhodes',
    code: 'RU',
    name: 'Rhodes University',
    location: 'Makhanda, Eastern Cape',
    province: 'Eastern Cape',
    ranking: 8,
    closeDate: '30 Sep',
    portalUrl: 'https://ross.ru.ac.za/',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    description: 'Prestigious institution renowned across Africa for Journalism & Media Studies, Humanities, Pharmacy, and Commerce.',
  },
  {
    id: 'uwc',
    code: 'UWC',
    name: 'Univ. of the Western Cape',
    location: 'Bellville, Western Cape',
    province: 'Western Cape',
    ranking: 9,
    closeDate: '30 Sep',
    portalUrl: 'https://www.uwc.ac.za/admission-and-financial-aid/undergraduate-admission/application-information',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    description: 'Rooted in a history of social justice, celebrated for Dentistry, Law, Community Health Sciences, and Biotechnology.',
  },
  {
    id: 'nmu',
    code: 'NMU',
    name: 'Nelson Mandela University',
    location: 'Gqeberha, Eastern Cape',
    province: 'Eastern Cape',
    ranking: 10,
    closeDate: '30 Sep',
    portalUrl: 'https://www.mandela.ac.za/study-at-mandela/application',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive university offering unique coastal marine sciences, engineering, automotive design, and health tech programs.',
  },
];

export default function ExploreScreen({
  universities = [],
  onNavigateHome = () => {},
  onSelectProgram = () => {},
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');

  // Combine props with our comprehensive Top 10 list
  const displayUniversities = useMemo(() => {
    return ALL_TOP_10_UNIVERSITIES;
  }, [universities]);

  const provinces = ['All', 'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'North West', 'Eastern Cape'];

  const filteredUniversities = useMemo(() => {
    return displayUniversities.filter((uni) => {
      const matchesSearch = 
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesProvince = selectedProvince === 'All' || uni.province === selectedProvince;

      return matchesSearch && matchesProvince;
    });
  }, [displayUniversities, searchQuery, selectedProvince]);

  const openPortal = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.warn('Could not open portal link:', e);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onNavigateHome}>
          <ArrowLeft color="#f4f4f5" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore Universities</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Search color="#71717a" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search university or location..."
            placeholderTextColor="#71717a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Province Filter Pills */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {provinces.map((prov) => {
            const isActive = selectedProvince === prov;
            return (
              <TouchableOpacity
                key={prov}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setSelectedProvince(prov)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{prov}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* University Cards List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>
          Showing {filteredUniversities.length} Top South African Universit{filteredUniversities.length === 1 ? 'y' : 'ies'}
        </Text>

        {filteredUniversities.length === 0 ? (
          <View style={styles.emptyBox}>
            <BookOpen color="#71717a" size={36} />
            <Text style={styles.emptyTitle}>No universities found</Text>
            <Text style={styles.emptySub}>Try adjusting your search query or province filter.</Text>
          </View>
        ) : (
          filteredUniversities.map((uni) => (
            <View key={uni.id} style={styles.uniCard}>
              <Image source={{ uri: uni.image }} style={styles.uniImage} resizeMode="cover" />
              <View style={styles.uniOverlay} />
              
              <View style={styles.uniCardBody}>
                <View style={styles.uniTopRow}>
                  <View style={styles.rankBadge}>
                    <Award color="#34d399" size={12} />
                    <Text style={styles.rankText}>Rank #{uni.ranking}</Text>
                  </View>
                  <View style={styles.deadlineBadge}>
                    <Calendar color="#f87171" size={12} />
                    <Text style={styles.deadlineText}>Closes: {uni.closeDate}</Text>
                  </View>
                </View>

                <Text style={styles.uniName}>{uni.name}</Text>
                
                <View style={styles.locationWrap}>
                  <MapPin color="#a1a1aa" size={13} />
                  <Text style={styles.locationText}>{uni.location}</Text>
                </View>

                <Text style={styles.uniDesc} numberOfLines={2}>{uni.description}</Text>

                <View style={styles.uniFooter}>
                  <TouchableOpacity 
                    style={styles.portalBtn} 
                    onPress={() => openPortal(uni.portalUrl)}
                  >
                    <Text style={styles.portalBtnText}>Apply Online Portal</Text>
                    <ExternalLink color="#ffffff" size={14} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },
  backBtn: { backgroundColor: '#141416', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#27272a' },
  headerTitle: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  searchWrapper: { paddingHorizontal: 16, marginBottom: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141416', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#27272a', height: 44, gap: 8 },
  searchInput: { flex: 1, color: '#f4f4f5', fontSize: 14 },
  filterWrapper: { marginBottom: 12 },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#141416', borderWidth: 1, borderColor: '#27272a', height: 34, justifyContent: 'center' },
  filterPillActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  filterText: { color: '#a1a1aa', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#ffffff' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  resultsCount: { color: '#71717a', fontSize: 12, marginBottom: 12, fontWeight: '600' },
  uniCard: { backgroundColor: '#141416', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a', marginBottom: 16, position: 'relative' },
  uniImage: { width: '100%', height: 140 },
  uniOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', height: 140 },
  uniCardBody: { padding: 16, marginTop: -20 },
  uniTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  rankBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  rankText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  deadlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#2a1215', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#7f1d1d' },
  deadlineText: { color: '#f87171', fontSize: 11, fontWeight: 'bold' },
  uniName: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { color: '#a1a1aa', fontSize: 12 },
  uniDesc: { color: '#a1a1aa', fontSize: 12, marginTop: 8, lineHeight: 17 },
  uniFooter: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#27272a', flexDirection: 'row', justifyContent: 'flex-end' },
  portalBtn: { backgroundColor: '#2563eb', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  portalBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  emptyBox: { backgroundColor: '#141416', borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#27272a', gap: 10, marginTop: 20 },
  emptyTitle: { color: '#f4f4f5', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
  emptySub: { color: '#a1a1aa', fontSize: 12, textAlign: 'center', lineHeight: 17 },
});
