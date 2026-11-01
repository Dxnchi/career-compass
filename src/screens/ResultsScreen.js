// Example inside src/screens/ResultsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getMatchingProgrammes } from '../services/programmeService';

export default function ResultsScreen({ route }) {
  // Pass parsed subjects from OCR or verification screen
  const { studentSubjects } = route.params; 
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const results = await getMatchingProgrammes(studentSubjects);
        setMatches(results);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [studentSubjects]);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.programmeId}
        renderItem={({ item }) => (
          <View style={{ padding: 12, marginVertical: 6, backgroundColor: '#f4f4f4' }}>
            <Text style={{ fontWeight: 'bold' }}>{item.programmeName}</Text>
            <Text>Faculty: {item.faculty}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Your APS: {item.studentAPS} (Min: {item.minAPS})</Text>
          </View>
        )}
      />
    </View>
  );
}