// src/screens/AdminUsersScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  ArrowLeft,
  Users,
  Radio,
  Clock,
  ShieldCheck,
  School,
  CreditCard,
  Eye,
  EyeOff,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export default function AdminUsersScreen({ onBack = () => {} }) {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revealIds, setRevealIds] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Collapsible section toggles
  const [showActiveSection, setShowActiveSection] = useState(true);
  const [showPriorSection, setShowPriorSection] = useState(false);
  const [showRegisteredSection, setShowRegisteredSection] = useState(false);

  const fetchUsers = async () => {
    try {
      // 1. Fetch existing profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_seen_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setUsersList(profiles || []);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const isCurrentlyActive = (timestamp) => {
    if (!timestamp) return false;
    const diffInMinutes = (new Date() - new Date(timestamp)) / (1000 * 60);
    return diffInMinutes <= 15;
  };

  const formatIdDisplay = (idStr) => {
    const clean = String(idStr || '').replace(/\s+/g, '');
    if (clean.length !== 13) return 'No Verified ID';
    if (revealIds) {
      return `${clean.slice(0, 6)} ${clean.slice(6, 10)} ${clean.slice(10, 12)} ${clean.slice(12)}`;
    }
    return `${clean.slice(0, 6)} •••• ${clean.slice(10, 12)} •`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter users based on search query (Name, School, or ID)
  const filteredUsers = usersList.filter((u) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (u.name || '').toLowerCase().includes(q);
    const schoolMatch = (u.school || '').toLowerCase().includes(q);
    const idMatch = (u.id_number || '').toLowerCase().includes(q);
    return nameMatch || schoolMatch || idMatch;
  });

  const activeUsers = filteredUsers.filter((u) => isCurrentlyActive(u.last_seen_at));
  const pastLoggedInUsers = filteredUsers.filter((u) => u.last_sign_in_at && !isCurrentlyActive(u.last_seen_at));
  const neverLoggedInUsers = filteredUsers.filter((u) => !u.last_sign_in_at && !u.last_seen_at);

  const renderUserIdRow = (item) => {
    const hasId = String(item.id_number || '').replace(/\s+/g, '').length === 13;
    return (
      <View style={styles.idRow}>
        <CreditCard color={hasId ? '#34d399' : '#71717a'} size={12} />
        <Text style={[styles.idText, hasId && { color: '#34d399' }]}>
          {formatIdDisplay(item.id_number)}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft color="#60a5fa" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Sessions & Directory</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.syncBtn} onPress={onRefresh}>
            <RefreshCw color="#60a5fa" size={14} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.maskToggleBtn}
            onPress={() => setRevealIds(!revealIds)}
          >
            {revealIds ? <EyeOff color="#60a5fa" size={14} /> : <Eye color="#60a5fa" size={14} />}
            <Text style={styles.maskToggleText}>{revealIds ? 'Mask IDs' : 'Show IDs'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Real-time telemetry of connected students, historical logins, and registered accounts.
      </Text>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Search color="#71717a" size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student name, school, or ID..."
          placeholderTextColor="#71717a"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearch}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Clickable KPI Cards (Toggles Sections) */}
      <View style={styles.kpiRow}>
        <TouchableOpacity
          style={[styles.kpiCard, showActiveSection && { borderColor: '#10b981', backgroundColor: '#0b1e17' }]}
          onPress={() => setShowActiveSection(!showActiveSection)}
        >
          <View style={styles.kpiHeader}>
            <Radio color="#10b981" size={16} />
            <Text style={[styles.kpiLabel, { color: '#10b981' }]}>Active Now</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.kpiVal}>{activeUsers.length}</Text>
            {showActiveSection ? <ChevronUp color="#10b981" size={16} /> : <ChevronDown color="#71717a" size={16} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.kpiCard, showPriorSection && { borderColor: '#3b82f6', backgroundColor: '#111827' }]}
          onPress={() => setShowPriorSection(!showPriorSection)}
        >
          <View style={styles.kpiHeader}>
            <Clock color="#60a5fa" size={16} />
            <Text style={styles.kpiLabel}>Prior Logins</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.kpiVal}>{pastLoggedInUsers.length}</Text>
            {showPriorSection ? <ChevronUp color="#60a5fa" size={16} /> : <ChevronDown color="#71717a" size={16} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.kpiCard, showRegisteredSection && { borderColor: '#8b5cf6', backgroundColor: '#1e1b4b' }]}
          onPress={() => setShowRegisteredSection(!showRegisteredSection)}
        >
          <View style={styles.kpiHeader}>
            <Users color="#a78bfa" size={16} />
            <Text style={[styles.kpiLabel, { color: '#a78bfa' }]}>Registered</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.kpiVal}>{usersList.length}</Text>
            {showRegisteredSection ? <ChevronUp color="#a78bfa" size={16} /> : <ChevronDown color="#71717a" size={16} />}
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#3b82f6" size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Collapsible Active Now Section */}
          {showActiveSection && (
            <View style={styles.sectionContainer}>
              <View style={styles.regHeaderRow}>
                <Text style={styles.sectionTitle}>Currently Online ({activeUsers.length})</Text>
                <TouchableOpacity onPress={() => setShowActiveSection(false)}>
                  <Text style={styles.closeRegText}>Hide</Text>
                </TouchableOpacity>
              </View>
              {activeUsers.length > 0 ? (
                activeUsers.map((item) => (
                  <View key={item.id} style={[styles.userCard, styles.activeCardBorder]}>
                    <View style={styles.userInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.userName}>{item.name || 'Unnamed Student'}</Text>
                        {item.role === 'admin' && (
                          <View style={styles.adminBadge}>
                            <ShieldCheck color="#60a5fa" size={11} />
                            <Text style={styles.adminBadgeText}>Admin</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.schoolRow}>
                        <School color="#71717a" size={13} />
                        <Text style={styles.schoolText}>
                          {item.school || 'Secondary School'} • {item.grade || 'Grade 12'}
                        </Text>
                      </View>
                      {renderUserIdRow(item)}
                    </View>
                    <View style={styles.statusWrap}>
                      <View style={styles.greenDot} />
                      <Text style={styles.onlineText}>Online</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No active users match your filter.</Text>
                </View>
              )}
            </View>
          )}

          {/* Collapsible Prior Logins Section */}
          {showPriorSection && (
            <View style={styles.sectionContainer}>
              <View style={styles.regHeaderRow}>
                <Text style={styles.sectionTitle}>Past Logged In Users ({pastLoggedInUsers.length})</Text>
                <TouchableOpacity onPress={() => setShowPriorSection(false)}>
                  <Text style={styles.closeRegText}>Hide</Text>
                </TouchableOpacity>
              </View>
              {pastLoggedInUsers.length > 0 ? (
                pastLoggedInUsers.map((item) => (
                  <View key={item.id} style={styles.userCard}>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.name || 'Student'}</Text>
                      <Text style={styles.schoolText}>
                        {item.school || 'Secondary School'} • {item.grade || 'Grade 12'}
                      </Text>
                      {renderUserIdRow(item)}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.metaLabel}>Last seen</Text>
                      <Text style={styles.metaVal}>
                        {formatDate(item.last_seen_at || item.last_sign_in_at)}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No prior user activity recorded.</Text>
                </View>
              )}
            </View>
          )}

          {/* Collapsible Registered Accounts Section */}
          {showRegisteredSection && (
            <View style={styles.sectionContainer}>
              <View style={styles.regHeaderRow}>
                <Text style={styles.sectionTitle}>All Registered Accounts ({usersList.length})</Text>
                <TouchableOpacity onPress={() => setShowRegisteredSection(false)}>
                  <Text style={styles.closeRegText}>Hide</Text>
                </TouchableOpacity>
              </View>
              {usersList.length > 0 ? (
                usersList.map((item) => (
                  <View key={item.id} style={styles.userCard}>
                    <View style={styles.userInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.userName}>{item.name || 'Student'}</Text>
                        {item.role === 'admin' && (
                          <View style={styles.adminBadge}>
                            <ShieldCheck color="#60a5fa" size={11} />
                            <Text style={styles.adminBadgeText}>Admin</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.schoolText}>
                        {item.school || 'Secondary School'} • {item.grade || 'Grade 12'}
                      </Text>
                      {renderUserIdRow(item)}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.metaLabel}>Registered</Text>
                      <Text style={styles.metaVal}>{formatDate(item.updated_at || item.last_sign_in_at)}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No registered profiles found in database.</Text>
                </View>
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0a0a', flexGrow: 1, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { padding: 4 },
  headerTitle: { color: '#f4f4f5', fontSize: 18, fontWeight: 'bold' },
  syncBtn: { padding: 8, backgroundColor: '#141416', borderRadius: 8, borderWidth: 1, borderColor: '#27272a' },
  maskToggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#172554', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#1e3a8a' },
  maskToggleText: { color: '#60a5fa', fontSize: 11, fontWeight: 'bold' },
  subtitle: { color: '#71717a', fontSize: 13, marginBottom: 14, marginTop: 4 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#141416', borderWidth: 1, borderColor: '#27272a', paddingHorizontal: 12, borderRadius: 12, marginBottom: 16 },
  searchInput: { flex: 1, color: '#ffffff', paddingVertical: 12, fontSize: 13 },
  clearSearch: { color: '#60a5fa', fontSize: 12, fontWeight: '600' },
  kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  kpiCard: { flex: 1, backgroundColor: '#141416', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#27272a' },
  kpiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  kpiLabel: { color: '#a1a1aa', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  kpiVal: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  sectionTitle: { color: '#f4f4f5', fontSize: 15, fontWeight: 'bold' },
  sectionContainer: { marginBottom: 20, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2937', borderRadius: 16, padding: 14 },
  userCard: { backgroundColor: '#141416', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#27272a', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  activeCardBorder: { borderColor: '#065f46', backgroundColor: '#0b1e17' },
  userInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName: { color: '#f4f4f5', fontSize: 14, fontWeight: 'bold' },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#172554', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  adminBadgeText: { color: '#60a5fa', fontSize: 10, fontWeight: 'bold' },
  schoolRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  schoolText: { color: '#71717a', fontSize: 12 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  idText: { color: '#71717a', fontSize: 11, fontWeight: '600' },
  statusWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
  onlineText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },
  metaLabel: { color: '#71717a', fontSize: 10 },
  metaVal: { color: '#d4d4d8', fontSize: 11, fontWeight: '500', marginTop: 2 },
  emptyBox: { padding: 18, alignItems: 'center', backgroundColor: '#141416', borderRadius: 12, marginTop: 8 },
  emptyText: { color: '#71717a', fontSize: 12 },
  regHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  closeRegText: { color: '#60a5fa', fontSize: 12, fontWeight: 'bold' },
});
