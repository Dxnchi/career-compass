import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';

import {
  INITIAL_SUBJECT_GRADES,
  INITIAL_PROGRAM_MATCHES,
  DEADLINES_DATA,
  fetchProgramsFromSupabase,
  fetchUniversitiesFromSupabase,
} from './src/data/dataStore';

// Utilities & Services
import { calculateAPS } from './src/utils/apsCalculator';
import { evaluateStudentEligibility } from './src/services/matchingEngine';
import { supabase } from './src/lib/supabase';

// Components & Modals
import Navigation from './src/components/Navigation';
import ApplicationModal from './src/components/ApplicationModal';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import ConfirmGradesScreen from './src/screens/ConfirmGradesScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProgramDetailScreen from './src/screens/ProgramDetailScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [user, setUser] = useState(null);
  const [grades, setGrades] = useState(INITIAL_SUBJECT_GRADES);
  const [programs, setPrograms] = useState(INITIAL_PROGRAM_MATCHES);
  const [universities, setUniversities] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(INITIAL_PROGRAM_MATCHES[0]);
  const [appModalVisible, setAppModalVisible] = useState(false);

  // Screen transition animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const navigateWithAnimation = (targetScreen) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -8,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentScreen(targetScreen);
      translateYAnim.setValue(12);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          speed: 16,
          bounciness: 4,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  useEffect(() => {
    // 1. Check existing session and fetch user profile
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: session.user.id,
                name: profile.name,
                email: session.user.email,
                school: profile.school,
                grade: profile.grade,
              });
              navigateWithAnimation('home');
            }
          });
      }
    });

    // 2. Auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        navigateWithAnimation('welcome');
      }
    });

    // 3. Load programmes and universities from Supabase
    async function loadData() {
      try {
        const [dbProgs, dbUnis] = await Promise.all([
          fetchProgramsFromSupabase(),
          fetchUniversitiesFromSupabase(),
        ]);
        if (dbProgs && dbProgs.length > 0) {
          setPrograms(dbProgs);
          setSelectedProgram(dbProgs[0]);
        }
        if (dbUnis && dbUnis.length > 0) {
          setUniversities(dbUnis);
        }
      } catch (err) {
        console.warn('Failed to load database records, using initial defaults:', err);
      }
    }
    loadData();

    return () => subscription.unsubscribe();
  }, []);

  // Recalculate APS whenever grades change
  const currentAps = useMemo(() => {
    const { totalAPS } = calculateAPS(grades);
    return totalAPS;
  }, [grades]);

  // Comprehensive matching: checks APS + subject prerequisites (standalone & groups)
  const dynamicMatches = useMemo(() => {
    if (!programs || programs.length === 0) return [];

    const evaluated = evaluateStudentEligibility(grades, programs);

    return evaluated.map((result) => {
      const requiredAps = result.minAPS || 0;
      const apsDiff = currentAps - requiredAps;
      let score = 50;

      if (result.status === 'DIRECT_MATCH') {
        score = Math.min(99, 85 + apsDiff * 2);
      } else if (result.status === 'ECP_ELIGIBLE' || apsDiff >= -3) {
        score = Math.max(65, 80 - Math.abs(apsDiff) * 3);
      } else {
        score = Math.max(30, 60 - Math.abs(apsDiff) * 2);
      }

      return {
        ...result,
        studentAps: currentAps,
        requiredAps: requiredAps,
        matchScore: Math.round(score),
        isEligible: result.status === 'DIRECT_MATCH',
      };
    });
  }, [grades, programs, currentAps]);

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    navigateWithAnimation('home');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
    navigateWithAnimation('welcome');
  };

  const handleScanDone = (scannedGrades) => {
    if (Array.isArray(scannedGrades) && scannedGrades.length > 0) {
      setGrades(scannedGrades);
    }
    navigateWithAnimation('confirm_grades');
  };

  const handleGradesConfirmed = (finalGrades) => {
    if (Array.isArray(finalGrades)) {
      setGrades(finalGrades);
    }
    navigateWithAnimation('matches');
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    navigateWithAnimation('program_detail');
  };

  const showBottomNav =
    Boolean(user) &&
    currentScreen !== 'welcome' &&
    currentScreen !== 'auth' &&
    currentScreen !== 'scan' &&
    currentScreen !== 'confirm_grades';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Animated.View
        style={[
          styles.body,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            user={user}
            onGetStarted={() => navigateWithAnimation(user ? 'home' : 'auth')}
            onOpenAuth={() => navigateWithAnimation('auth')}
            onOpenTerms={() => navigateWithAnimation('settings')}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen
            onAuthSuccess={handleAuthSuccess}
            onCancel={() => navigateWithAnimation('welcome')}
          />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            user={user || { name: 'Student' }}
            matches={dynamicMatches}
            deadlines={DEADLINES_DATA}
            currentAps={currentAps}
            onNavigate={navigateWithAnimation}
            onSelectProgram={handleSelectProgram}
          />
        )}

        {currentScreen === 'scan' && (
          <ScanScreen
            onCancel={() => navigateWithAnimation('home')}
            onClose={() => navigateWithAnimation('home')}
            onScanComplete={handleScanDone}
          />
        )}

        {currentScreen === 'confirm_grades' && (
          <ConfirmGradesScreen
            initialGrades={grades}
            onBack={() => navigateWithAnimation('scan')}
            onConfirm={handleGradesConfirmed}
            onConfirmAndMatch={handleGradesConfirmed}
            onRescan={() => navigateWithAnimation('scan')}
          />
        )}

        {currentScreen === 'matches' && (
          <MatchesScreen
            matches={dynamicMatches}
            onBack={() => navigateWithAnimation('home')}
            onSelectProgram={handleSelectProgram}
          />
        )}

        {currentScreen === 'program_detail' && (
          <ProgramDetailScreen
            program={selectedProgram}
            onBack={() => navigateWithAnimation('matches')}
            onStartApplication={() => setAppModalVisible(true)}
          />
        )}

        {currentScreen === 'explore' && (
          <ExploreScreen
            universities={universities}
            onNavigateHome={() => navigateWithAnimation('home')}
            onSelectProgram={handleSelectProgram}
          />
        )}

        {currentScreen === 'notifications' && (
          <NotificationsScreen
            deadlines={DEADLINES_DATA}
            onBack={() => navigateWithAnimation('home')}
            onNavigate={navigateWithAnimation}
            onSelectProgram={handleSelectProgram}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            user={user || { name: 'Student', school: 'Secondary School', grade: 'Grade 12' }}
            currentAps={currentAps}
            onNavigateSettings={() => navigateWithAnimation('settings')}
            onNavigate={navigateWithAnimation}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            user={user || { name: 'Student', school: '' }}
            onBack={() => navigateWithAnimation('profile')}
            onSaveUser={(updated) => setUser(updated)}
            onUpdateUser={(updated) => setUser(updated)}
            onLogout={handleLogout}
          />
        )}
      </Animated.View>

      {showBottomNav && (
        <Navigation
          currentScreen={currentScreen}
          onNavigate={navigateWithAnimation}
        />
      )}

      <ApplicationModal
        visible={appModalVisible}
        program={selectedProgram}
        onClose={() => setAppModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  body: {
    flex: 1,
  },
});
