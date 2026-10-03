import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Header } from './src/components/Header';
import { SubmitScreen } from './src/screens/SubmitScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type TabName = 'submit' | 'feed' | 'leaderboard' | 'settings';

const AppContent: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabName>('feed');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'submit':
        return <SubmitScreen onNavigateToFeed={() => setActiveTab('feed')} />;
      case 'feed':
        return <FeedScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <FeedScreen />;
    }
  };

  const tabs: { id: TabName; label: string; icon: string }[] = [
    { id: 'submit', label: 'Submit', icon: '💡' },
    { id: 'feed', label: 'Feed', icon: '📜' },
    { id: 'leaderboard', label: 'Ranking', icon: '🏆' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <Header />

      <View style={[styles.body, { backgroundColor: colors.background }]}>
        {renderActiveScreen()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? colors.primary : colors.textSecondary },
                  isActive && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  activeTabIcon: {
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeTabLabel: {
    fontWeight: '800',
  },
});
