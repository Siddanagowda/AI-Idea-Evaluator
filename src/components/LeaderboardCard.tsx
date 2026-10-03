import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Idea } from '../types/idea';
import { useTheme } from '../context/ThemeContext';

interface LeaderboardCardProps {
  idea: Idea;
  rank: number;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ idea, rank }) => {
  const { colors, isDark } = useTheme();

  const getRankBadge = (rankNum: number) => {
    switch (rankNum) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rankNum}`;
    }
  };

  const getGradientColors = (rankNum: number): [string, string] => {
    if (isDark) {
      switch (rankNum) {
        case 1:
          return ['#78350F', '#1E293B']; // Gold Dark
        case 2:
          return ['#334155', '#1E293B']; // Silver Dark
        case 3:
          return ['#7C2D12', '#1E293B']; // Bronze Dark
        default:
          return ['#1E293B', '#1E293B'];
      }
    } else {
      switch (rankNum) {
        case 1:
          return ['#FEF3C7', '#FFFFFF']; // Gold Light
        case 2:
          return ['#F1F5F9', '#FFFFFF']; // Silver Light
        case 3:
          return ['#FFEDD5', '#FFFFFF']; // Bronze Light
        default:
          return ['#FFFFFF', '#FFFFFF'];
      }
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors(rank)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderColor: rank <= 3 ? colors.accent : colors.border, shadowColor: colors.cardShadow }]}
    >
      <View style={styles.rankBadgeContainer}>
        <Text style={styles.rankText}>{getRankBadge(rank)}</Text>
      </View>

      <View style={styles.infoArea}>
        <Text style={[styles.title, { color: colors.text }]}>{idea.startupName}</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]} numberOfLines={1}>
          {idea.tagline}
        </Text>
      </View>

      <View style={styles.metricsArea}>
        <View style={styles.metricBadge}>
          <Text style={styles.metricIcon}>👍</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>{idea.votes}</Text>
        </View>

        <View style={styles.metricBadge}>
          <Text style={styles.metricIcon}>⭐</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>{idea.evaluation.score}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankBadgeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 22,
    fontWeight: '800',
  },
  infoArea: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  tagline: {
    fontSize: 12,
  },
  metricsArea: {
    alignItems: 'flex-end',
  },
  metricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  metricIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
  },
});
