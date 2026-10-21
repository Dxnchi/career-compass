import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Home, Scan, GraduationCap, Compass, User } from 'lucide-react-native';
import AnimatedPressable from './AnimatedPressable';

export default function Navigation({ currentScreen, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'scan', label: 'Scan', icon: Scan },
    { id: 'matches', label: 'Matches', icon: GraduationCap },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <View style={styles.navContainer}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;
        return (
          <AnimatedPressable
            key={tab.id}
            style={styles.navButton}
            scaleTo={0.88}
            onPress={() => onNavigate(tab.id)}
          >
            <Icon color={isActive ? '#3b82f6' : '#71717a'} size={22} />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {tab.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    backgroundColor: '#0d0d0f',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  navLabel: {
    color: '#71717a',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#3b82f6',
    fontWeight: '700',
  },
});
