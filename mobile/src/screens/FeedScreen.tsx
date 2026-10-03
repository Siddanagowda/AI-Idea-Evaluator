import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getStoredIdeas, upvoteIdea, getVotedIdeaIds } from '../services/storage';
import { Idea, SortOption } from '../types/idea';
import { IdeaCard } from '../components/IdeaCard';
import { SortSelector } from '../components/SortSelector';
import { Toast } from '../components/Toast';

export const FeedScreen: React.FC = () => {
  const { colors } = useTheme();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('rating');
  const [refreshing, setRefreshing] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const loadData = useCallback(async () => {
    const loadedIdeas = await getStoredIdeas();
    const loadedVoted = await getVotedIdeaIds();
    setIdeas(loadedIdeas);
    setVotedIds(loadedVoted);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleUpvote = async (ideaId: string) => {
    const { ideas: updatedIdeas, success } = await upvoteIdea(ideaId);
    if (success) {
      setIdeas(updatedIdeas);
      setVotedIds((prev) => [...prev, ideaId]);
      showToast('👍 Upvote recorded!');
    } else {
      showToast('⚠️ You have already upvoted this idea!');
    }
  };

  // Filter & Sort
  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortOption === 'rating') {
      return b.evaluation.score - a.evaluation.score;
    }
    if (sortOption === 'votes') {
      return b.votes - a.votes;
    }
    // Newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
          ]}
          placeholder="🔍 Search ideas by keyword, tagline..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Sort Options */}
      <SortSelector currentSort={sortOption} onSelectSort={setSortOption} />

      {/* Ideas List */}
      <FlatList
        data={sortedIdeas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IdeaCard
            idea={item}
            hasVoted={votedIds.includes(item.id)}
            onUpvote={handleUpvote}
            onShowToast={showToast}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>💡</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Startup Ideas Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {searchQuery ? 'Try clearing your search query.' : 'Be the first to submit a new idea!'}
            </Text>
          </View>
        }
      />

      <Toast message={toastMessage} visible={toastVisible} onHide={() => setToastVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
});
