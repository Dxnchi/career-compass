import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Search, MapPin, ExternalLink, GraduationCap } from 'lucide-react-native';

// Fallback South African university database if Supabase table is empty
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Explore SA Universities</Text>
      <Text style={styles.subtitle}>Verified faculty requirements, portals, and intake deadlines.</Text>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search color="#71717a" size={18} />
        <TextInput
          placeholder="Search by institution name, code, or city..."
          placeholderTextColor="#71717a"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Province Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
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
              {uni?.image ? (
                <Image source={{ uri: uni.image }} style={styles.cardImg} />
              ) : (
                <View style={[styles.cardImg, { backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' }]}>
                  <GraduationCap color="#60a5fa" size={32} />
                </View>
              )}

              <View style={styles.cardBody}>
                <View style={styles.rankRow}>
                  <Text style={styles.rankBadge}>
                    {uni.code ? uni.code : `Rank #${uni.ranking || '--'}`}
                  </Text>
                  <Text style={styles.deadlineBadge}>
                    Apps Close: {uni.closeDate || 'Check portal'}
                  </Text>
                </View>

                <Text style={styles.uniName}>{uni.name}</Text>

                <View style={styles.locRow}>
                  <MapPin color="#71717a" size={13} />
                  <Text style={styles.locText}>{uni.location || 'South Africa'}</Text>
                </View>

                <Text style={styles.desc} numberOfLines={2}>
                  {uni.description || 'Undergraduate faculty admission requirements and prospectus.'}
                </Text>

                <View style={styles.portalRow}>
                  <Text style={styles.portalText}>Official Admissions Portal</Text>
                  <ExternalLink color="#3b82f6" size={14} />
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No institutions match your search criteria.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  title: { color: '#f4f4f5', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#a1a1aa', fontSize: 13, marginTop: 4, marginBottom: 14 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#141416', paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#27272a', marginBottom: 12 },
  searchInput: { color: '#ffffff', flex: 1, paddingVertical: 10, fontSize: 13 },
  filterBar: { flexDirection: 'row', marginBottom: 16 },
  filterChip: { backgroundColor: '#141416', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#27272a' },
  filterChipActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  filterLabel: { color: '#71717a', fontSize: 12, fontWeight: '600' },
  filterLabelActive: { color: '#ffffff' },
  list: { gap: 14, paddingBottom: 24 },
  card: { backgroundColor: '#141416', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a' },
  cardImg: { width: '100%', height: 130 },
  cardBody: { padding: 14 },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rankBadge: { color: '#60a5fa', fontSize: 11, fontWeight: 'bold', backgroundColor: '#172554', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  deadlineBadge: { color: '#f87171', fontSize: 11, fontWeight: '600' },
  uniName: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 4 },
  locText: { color: '#71717a', fontSize: 12 },
  desc: { color: '#a1a1aa', fontSize: 12, lineHeight: 18, marginTop: 4 },
  portalRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#27272a' },
  portalText: { color: '#3b82f6', fontSize: 12, fontWeight: '600' },
  emptyBox: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#71717a', fontSize: 13 },
});
