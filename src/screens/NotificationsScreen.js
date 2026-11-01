import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { ArrowLeft, ExternalLink, Calendar, Bell, Info } from 'lucide-react-native';
import { DEADLINES_DATA } from '../data/dataStore';

// Expanded default alerts covering common South African matric dates
const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Funding',
    month: 'SEP',
    day: '01',
    title: 'NSFAS Online Applications Open',
    subtitle: 'Apply early on my.nsfas.org.za with certified ID and proof of household income.',
    url: 'https://my.nsfas.org.za/',
  },
  {
    id: 'notif-2',
    category: 'Admissions',
    month: 'SEP',
    day: '30',
    title: 'General University Admissions Close',
    subtitle: 'Final deadline for undergraduate degree submissions at UJ, Wits, and UKZN.',
    url: 'https://www.uj.ac.za/admissions-aid/apply/',
  },
  {
    id: 'notif-3',
    category: 'Testing',
    month: 'OCT',
    day: '14',
    title: 'National Benchmark Test (NBT) Session',
    subtitle: 'Ensure MAT and AQL test bookings are finalized if required by your faculty.',
    url: 'https://www.nbt.ac.za/',
  },
  {
    id: 'notif-4',
    category: 'Funding',
    month: 'NOV',
    day: '30',
    title: 'NSFAS Application Deadline',
    subtitle: 'Final cutoff date for government student bursary applications.',
    url: 'https://my.nsfas.org.za/',
  },
];

export default function NotificationsScreen({
  deadlines = [],
  onBack = () => {},
}) {
  const [activeTab, setActiveTab] = useState('all');

  const rawData = Array.isArray(deadlines) && deadlines.length > 0 
    ? deadlines 
    : DEFAULT_NOTIFICATIONS;

  const filtered = rawData.filter((item) => {
    if (!item) return false;
    if (activeTab === 'funding') return (item.category || '').toLowerCase() === 'funding' || (item.title || '').toLowerCase().includes('nsfas');
    if (activeTab === 'admissions') return (item.category || '').toLowerCase() === 'admissions' || (item.title || '').toLowerCase().includes('application');
    return true;
  });

  const handleOpenLink = async (url) => {
    if (!url) return;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Notice', 'Cannot open the browser link.');
      }
    } catch (err) {
      console.warn('Failed to open link:', err);
    }
  };

  const getCategoryColor = (category = '') => {
    switch (category.toLowerCase()) {
      case 'funding':
        return { bg: '#064e3b', text: '#34d399' };
      case 'admissions':
        return { bg: '#172554', text: '#60a5fa' };
      case 'testing':
        return { bg: '#451a03', text: '#fbbf24' };
      default:
        return { bg: '#27272a', text: '#a1a1aa' };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft color="#60a5fa" size={22} />
          </TouchableOpacity>
        )}
        <Text style={styles.heading}>Alerts & Deadlines</Text>
      </View>

      <Text style={styles.subtitle}>
        Crucial dates for NSC submissions, NSFAS bursaries, and university intakes.
      </Text>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {[
          { id: 'all', label: 'All Dates' },
          { id: 'admissions', label: 'Admissions' },
          { id: 'funding', label: 'NSFAS & Aid' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabChip, activeTab === tab.id && styles.tabChipActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      <View style={styles.list}>
        {filtered.length > 0 ? (
          filtered.map((item, index) => {
            const catColors = getCategoryColor(item.category);

            return (
              <TouchableOpacity
                key={item?.id || `deadline-${index}`}
                style={styles.card}
                activeOpacity={item.url ? 0.75 : 1}
                onPress={() => item.url && handleOpenLink(item.url)}
              >
                {/* Calendar Date Block */}
                <View style={styles.dateBlock}>
                  <Text style={styles.month}>{item?.month || 'DATE'}</Text>
                  <Text style={styles.day}>{item?.day || '--'}</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <View style={styles.badgeRow}>
                    {item.category && (
                      <View style={[styles.categoryBadge, { backgroundColor: catColors.bg }]}>
                        <Text style={[styles.categoryText, { color: catColors.text }]}>
                          {item.category}
                        </Text>
                      </View>
                    )}
                    {item.url && <ExternalLink color="#71717a" size={13} />}
                  </View>

                  <Text style={styles.title}>{item?.title || 'Notice'}</Text>
                  <Text style={styles.text}>{item?.subtitle || ''}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Info color="#71717a" size={24} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>No notifications found for this category.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  backBtn: { padding: 4 },
  heading: { color: '#f4f4f5', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#a1a1aa', fontSize: 13, marginBottom: 14 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tabChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#141416', borderWidth: 1, borderColor: '#27272a' },
  tabChipActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  tabLabel: { color: '#71717a', fontSize: 12, fontWeight: '600' },
  tabLabelActive: { color: '#ffffff' },
  list: { gap: 12, paddingBottom: 24 },
  card: { backgroundColor: '#141416', borderRadius: 16, borderWidth: 1, borderColor: '#27272a', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  dateBlock: { backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 8, alignItems: 'center', width: 48, borderWidth: 1, borderColor: '#334155' },
  month: { color: '#f87171', fontSize: 10, fontWeight: 'bold' },
  day: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  content: { flex: 1 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  categoryBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  categoryText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  title: { color: '#f4f4f5', fontSize: 14, fontWeight: '600' },
  text: { color: '#a1a1aa', fontSize: 12, marginTop: 2, lineHeight: 16 },
  emptyCard: { padding: 32, alignItems: 'center', backgroundColor: '#141416', borderRadius: 14, marginTop: 10 },
  emptyText: { color: '#71717a', fontSize: 13 },
});
