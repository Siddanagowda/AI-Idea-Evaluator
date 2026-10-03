import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { clearAllData } from '../services/storage';
import { Toast } from '../components/Toast';

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  useEffect(() => {
    const checkApi = async () => {
      const url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
      try {
        const res = await fetch(`${url}/health`, { method: 'GET' });
        if (res.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (e) {
        setApiStatus('offline');
      }
    };
    checkApi();
  }, []);

  const handleResetData = () => {
    Alert.alert(
      'Reset Storage',
      'Are you sure you want to reset all ideas and voting data back to initial seed state?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            showToast('🔄 Storage reset to initial sample seed data!');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>PREFERENCES</Text>

      {/* Dark Mode Switch */}
      <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.settingTitle, { color: colors.text }]}>🌙 Dark Mode</Text>
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            Toggle application color theme
          </Text>
        </View>
        <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: colors.border, true: colors.primary }} />
      </View>

      <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>BACKEND & API STATUS</Text>

      {/* API Health */}
      <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.settingTitle, { color: colors.text }]}>🤖 FastAPI + Gemini API</Text>
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text
            style={[
              styles.statusText,
              { color: apiStatus === 'online' ? colors.success : colors.warning },
            ]}
          >
            {apiStatus === 'online' ? '🟢 Online' : apiStatus === 'checking' ? '🟡 Checking...' : '🟠 Fallback'}
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>DATA MANAGEMENT</Text>

      {/* Reset Data */}
      <TouchableOpacity
        style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={handleResetData}
      >
        <View>
          <Text style={[styles.settingTitle, { color: colors.error }]}>🗑️ Reset Demo Data</Text>
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            Restore initial seed ideas & clear upvote history
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>ABOUT APP</Text>
      <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Startup Idea Evaluator 🚀</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Built for Mobile App Internship Assignment using React Native, Expo, TypeScript, AsyncStorage, FastAPI, and Google Gemini 2.5 Flash API.
        </Text>
        <Text style={[styles.versionText, { color: colors.primary }]}>Version 1.0.0</Text>
      </View>

      <Toast message={toastMessage} visible={toastVisible} onHide={() => setToastVisible(false)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoBox: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
