import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Image } from 'react-native';
import { Search, MapPin } from 'lucide-react-native';
import { UNIVERSITIES_DATA } from '../data/dataStore';

export default function ExploreScreen({ universities = UNIVERSITIES_DATA }) {
  const [query, setQuery] = useState('');

  const safeList = Array.isArray(universities) ? universities : UNIVERSITIES_DATA;
  const filtered = safeList.filter((u) => {
    if (!u) return false;
    const nameMatch = u.name ? u.name.toLowerCase().includes(query.toLowerCase()) : false;
    const locMatch = u.location ? u.location.toLowerCase().includes(query.toLowerCase()) : false;
    return nameMatch || locMatch;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Explore SA Universities</Text>
      <Text style={styles.subtitle}>Verified faculty requirements and intake deadlines.</Text>

      <View style={styles.searchBox}>
        <Search color="#71717a" size={18} />
        <TextInput
          placeholder="Search by university name or city..."
          placeholderTextColor="#71717a"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.list}>
        {filtered.map((uni) => (
          <View key={uni.id || Math.random().toString()} style={styles.card}>
            {uni?.image ? (
              <Image source={{ uri: uni.image }} style={styles.cardImg} />
            ) : (
              <View style={[styles.cardImg, { backgroundColor: '#1e293b' }]} />
            )}
            <View style={styles.cardBody}>
              <View style={styles.rankRow}>
                <Text style={styles.rankBadge}>Rank #{uni.ranking || '--'}</Text>
                <Text style={styles.deadlineBadge}>Closes: {uni.closeDate || 'Check portal'}</Text>
              </View>
              <Text style={styles.uniName}>{uni.name}</Text>
              <View style={styles.locRow}>
                <MapPin color="#71717a" size={13} />
                <Text style={styles.locText}>{uni.location}</Text>
              </View>
              <Text style={styles.desc}>{uni.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  title: { color: '#f4f4f5', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#a1a1aa', fontSize: 13, marginTop: 4, marginBottom: 14 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#141416', paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#27272a', marginBottom: 16 },
  searchInput: { color: '#ffffff', flex: 1, paddingVertical: 10, fontSize: 13 },
  list: { gap: 14, paddingBottom: 24 },
  card: { backgroundColor: '#141416', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a' },
  cardImg: { width: '100%', height: 130 },
  cardBody: { padding: 14 },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rankBadge: { color: '#3b82f6', fontSize: 11, fontWeight: 'bold' },
  deadlineBadge: { color: '#f87171', fontSize: 11, fontWeight: '600' },
  uniName: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 4 },
  locText: { color: '#71717a', fontSize: 12 },
  desc: { color: '#a1a1aa', fontSize: 12, lineHeight: 18, marginTop: 4 },
});
