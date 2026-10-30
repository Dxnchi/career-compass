import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Image, TouchableOpacity, Linking, Alert, SafeAreaView } from 'react-native';
import { Search, MapPin, ExternalLink, GraduationCap } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../components/theme';

const DEFAULT_SA_UNIVERSITIES = [
  {
    id: 'uj',
    code: 'UJ',
    name: 'University of Johannesburg',
    location: 'Johannesburg, Gauteng',
    province: 'Gauteng',
    ranking: 5,
    closeDate: '30 Sep',
    portalUrl: 'https://www.uj.ac.za/admissions-aid/apply/',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: 'Renowned for Science, Accounting, Engineering, and cutting-edge 4IR initiatives.',
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
    description: 'World-class research institution leading in Medicine, Mining, Commerce, and Law.',
  },
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
    description: 'Top-ranked African university offering prestigious faculties across all academic disciplines.',
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
    description: 'Leader in Engineering (EBIT), Veterinary Science, Law, and Health Sciences.',
  },
  {
    id: 'sun',
    code: 'SUN',
    name: 'Stellenbosch University',
    location: 'Stellenbosch, Western Cape',
    province: 'Western Cape',
    ranking: 3,
    closeDate: '31 Jul',
    portalUrl: 'https://www.sun.ac.za/english/matrics',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Premier academic and research university recognized for AgriSciences, Engineering, and Business.',
  },
  {
    id: 'ukzn',
    code: 'UKZN',
    name: 'University of KwaZulu-Natal',
    location: 'Durban, KwaZulu-Natal',
    province: 'KwaZulu-Natal',
    ranking: 6,
    closeDate: '30 Sep',
    portalUrl: 'https://applications.ukzn.ac.za/',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80',
    description: 'Major regional powerhouse known for Medical Sciences, Humanities, and Law.',
  },
];

export default function ExploreScreen({
  universities = [],
  onNavigateHome = () => {},
}) {
  const [query, setQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');

  const rawList = Array.isArray(universities) && universities.length > 0 
    ? universities 
    : DEFAULT_SA_UNIVERSITIES;

  const provinces = ['All', 'Gauteng', 'Western Cape', 'KwaZulu-Natal'];

  const filtered = rawList.filter((u) => {
    if (!u) return false;
    const nameMatch = u.name ? u.name.toLowerCase().includes(query.toLowerCase()) : false;
    const locMatch = u.location ? u.location.toLowerCase().includes(query.toLowerCase()) : false;
    const codeMatch = u.code ? u.code.toLowerCase().includes(query.toLowerCase()) : false;
    const matchesSearch = nameMatch || locMatch || codeMatch;

    const matchesProvince = 
      selectedProvince === 'All' || 
      (u.province && u.province.toLowerCase() === selectedProvince.toLowerCase()) ||
      (u.location && u.location.toLowerCase().includes(selectedProvince.toLowerCase()));

    return matchesSearch && matchesProvince;
  });

  const handleOpenUniversity = async (uni) => {
    const url = uni.portalUrl || `https://www.google.com/search?q=${encodeURIComponent(uni.name + ' admissions')}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Unable to open link', 'Could not open the browser for this institution.');
      }
    } catch (e) {
      console.warn('Error opening portal URL:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Fun Background Shapes */}
      <View style={[styles.shape, styles.shapePurple]} />
      <View style={[styles.shape, styles.shapeYellow]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Find your perfect university match.</Text>
        </View>

        {/* Search Box */}
        <View style={styles.searchBox}>
          <Search color={COLORS.textGray} size={20} />
          <TextInput
            placeholder="Search by name, code, or city..."
            placeholderTextColor={COLORS.textGray}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* Province Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {provinces.map((prov) => (
            <TouchableOpacity
              key={prov}
              style={[styles.filterChip, selectedProvince === prov && styles.filterChipActive]}
              onPress={() => setSelectedProvince(prov)}
            >
              <Text style={[styles.filterLabel, selectedProvince === prov && styles.filterLabelActive]}>
                {prov}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Universities List */}
        <View style={styles.list}>
          {filtered.length > 0 ? (
            filtered.map((uni, idx) => (
              <TouchableOpacity
                key={uni.id || uni.code || `uni-${idx}`}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleOpenUniversity(uni)}
              >
                {/* Image Section */}
                {uni?.image ? (
                  <Image source={{ uri: uni.image }} style={styles.cardImg} />
                ) : (
                  <View style={[styles.cardImg, { backgroundColor: '#E8E0FF', justifyContent: 'center', alignItems: 'center' }]}>
                    <GraduationCap color={COLORS.primary} size={40} />
                  </View>
                )}

                {/* Content Section */}
                <View style={styles.cardBody}>
                  
                  <View style={styles.badgeRow}>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeText}>{uni.code || `Rank #${uni.ranking}`}</Text>
                    </View>
                    <View style={styles.deadlineBadge}>
                      <Text style={styles.deadlineText}>Closes: {uni.closeDate || 'Check portal'}</Text>
                    </View>
                  </View>

                  <Text style={styles.uniName}>{uni.name}</Text>

                  <View style={styles.locRow}>
                    <MapPin color={COLORS.textGray} size={14} />
                    <Text style={styles.locText}>{uni.location || 'South Africa'}</Text>
                  </View>

                  <Text style={styles.desc} numberOfLines={2}>
                    {uni.description || 'Undergraduate faculty admission requirements and prospectus.'}
                  </Text>

                  <View style={styles.portalRow}>
                    <Text style={styles.portalText}>Apply on Portal</Text>
                    <ExternalLink color={COLORS.primary} size={16} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No institutions match your search.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, overflow: 'hidden' },

  // Fun Background Shapes
  shape: { position: 'absolute', borderRadius: 1000, opacity: 0.5 },
  shapePurple: { width: 300, height: 300, backgroundColor: '#E8E0FF', top: -100, left: -100 },
  shapeYellow: { width: 150, height: 150, backgroundColor: '#FFF3E0', top: 200, right: -50 },

  header: { paddingHorizontal: SIZES.padding, paddingTop: 20, marginBottom: 20 },
  title: { fontSize: SIZES.h1, fontWeight: '800', color: COLORS.textDark },
  subtitle: { fontSize: 14, color: COLORS.textGray, fontWeight: '500', marginTop: 4 },

  // Search
  searchBox: { 
    flexDirection: 'row', alignItems: 'center', gap: 10, 
    backgroundColor: COLORS.white, paddingHorizontal: 16, height: 56, 
    marginHorizontal: SIZES.padding, borderRadius: SIZES.radius, ...SHADOWS.light 
  },
  searchInput: { color: COLORS.textDark, flex: 1, fontSize: 15 },

  // Filter Chips
  filterBar: { paddingHorizontal: SIZES.padding, paddingVertical: 20, gap: 10 },
  filterChip: { 
    backgroundColor: COLORS.white, paddingHorizontal: 18, paddingVertical: 10, 
    borderRadius: 20, ...SHADOWS.light 
  },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterLabel: { color: COLORS.textGray, fontSize: 13, fontWeight: '600' },
  filterLabelActive: { color: COLORS.white },

  // University Cards
  list: { paddingHorizontal: SIZES.padding, gap: 20 },
  card: { 
    backgroundColor: COLORS.white, borderRadius: 24, overflow: 'hidden', 
    ...SHADOWS.light 
  },
  cardImg: { width: '100%', height: 140 },
  cardBody: { padding: 16 },
  
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  codeBadge: { backgroundColor: '#E8E0FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  codeText: { color: COLORS.primary, fontSize: 11, fontWeight: '800' },
  deadlineBadge: { backgroundColor: '#FFE8E8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  deadlineText: { color: '#FF3B30', fontSize: 11, fontWeight: '800' },

  uniName: { color: COLORS.textDark, fontSize: 18, fontWeight: '800', marginBottom: 6 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  locText: { color: COLORS.textGray, fontSize: 13, fontWeight: '500' },
  desc: { color: COLORS.textGray, fontSize: 13, lineHeight: 20 },

  portalRow: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' 
  },
  portalText: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },

  emptyBox: { padding: 40, alignItems: 'center' },
  emptyText: { color: COLORS.textGray, fontSize: 14, fontWeight: '500' },
});