import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const Header: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View>
        <Text style={[styles.title, { color: colors.text }]}>Startup Evaluator 🚀</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>AI Feedback & Community Voting</Text>
      </View>
      <TouchableOpacity
        style={[styles.themeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
        onPress={toggleTheme}
      >
        <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  themeIcon: {
    fontSize: 18,
  },
});
