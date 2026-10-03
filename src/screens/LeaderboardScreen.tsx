import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getStoredIdeas } from '../services/storage';
import { Idea } from '../types/idea';
import { LeaderboardCard } from '../components/LeaderboardCard';

export const LeaderboardScreen: React.FC = () => {
  const { colors } = useTheme();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [leaderboardType, setLeaderboardType] = useState<'community' | 'ai'>('community');

  useEffect(() => {
    getStoredIdeas().then((data) => setIdeas(data));
  }, []);

  // Calculate top 5
  const topIdeas = [...ideas]
    .sort((a, b) => {
      if (leaderboardType === 'community') {
        return b.votes - a.votes;
      }
      return b.evaluation.score - a.evaluation.score;
    })
    .slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={[styles.bannerTitle, { color: colors.text }]}>🏆 Startup Leaderboard</Text>
        <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
          Discover the highest-rated and most upvoted startup concepts.
        </Text>
      </View>

      {/* Segmented Control Toggle */}
      <View style={[styles.segmentedContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            leaderboardType === 'community' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setLeaderboardType('community')}
        >
          <Text
            style={[
              styles.segmentText,
              { color: leaderboardType === 'community' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            🏆 Community Votes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, leaderboardType === 'ai' && { backgroundColor: colors.primary }]}
          onPress={() => setLeaderboardType('ai')}
        >
          <Text
            style={[
              styles.segmentText,
              { color: leaderboardType === 'ai' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            🤖 AI Top Scores
          </Text>
        </TouchableOpacity>
      </View>

      {/* Leaderboard List */}
      <FlatList
        data={topIdeas}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <LeaderboardCard idea={item} rank={index + 1} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No ideas available for ranking yet.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  segmentedContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 4,
    borderRadius: 24,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
