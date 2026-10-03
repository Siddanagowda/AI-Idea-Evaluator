import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Idea } from '../types/idea';
import { useTheme } from '../context/ThemeContext';
import { RatingBadge } from './RatingBadge';
import { ScoreBreakdownModal } from './ScoreBreakdownModal';

interface IdeaCardProps {
  idea: Idea;
  hasVoted: boolean;
  onUpvote: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, hasVoted, onUpvote, onShowToast }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleShare = async () => {
    const textToCopy = `🚀 Startup Idea: ${idea.startupName}\n💡 Tagline: "${idea.tagline}"\n🤖 AI Score: ${idea.evaluation.score}/100\n👍 Votes: ${idea.votes}\n\nDescription:\n${idea.description}`;
    await Clipboard.setStringAsync(textToCopy);
    onShowToast('📋 Idea copied to clipboard!');
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.cardShadow }]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerTitleArea}>
          <Text style={[styles.title, { color: colors.text }]}>{idea.startupName}</Text>
          <Text style={[styles.tagline, { color: colors.primary }]}>{idea.tagline}</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <RatingBadge score={idea.evaluation.score} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={expanded ? undefined : 2}>
        {idea.description}
      </Text>

      {expanded && (
        <View style={[styles.expandedSection, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.aiQuoteTitle, { color: colors.text }]}>🤖 AI Feedback:</Text>
          <Text style={[styles.aiQuoteText, { color: colors.textSecondary }]}>"{idea.evaluation.feedback}"</Text>

          <TouchableOpacity style={styles.viewFullAnalysisBtn} onPress={() => setModalVisible(true)}>
            <Text style={[styles.viewFullAnalysisText, { color: colors.primary }]}>
              🔍 View Full AI Analysis Breakdown →
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.readMoreBtn} onPress={() => setExpanded(!expanded)}>
          <Text style={[styles.readMoreText, { color: colors.textSecondary }]}>
            {expanded ? 'Show Less ▲' : 'Read More ▼'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionGroup}>
          <TouchableOpacity style={[styles.iconBtn, { borderColor: colors.border }]} onPress={handleShare}>
            <Text style={{ fontSize: 14 }}>📋</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.upvoteBtn,
              {
                backgroundColor: hasVoted ? colors.border : colors.primary,
              },
            ]}
            onPress={() => onUpvote(idea.id)}
            disabled={hasVoted}
          >
            <Text style={[styles.upvoteText, { color: hasVoted ? colors.textSecondary : '#FFFFFF' }]}>
              {hasVoted ? '👍 Voted' : '👍 Upvote'} ({idea.votes})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScoreBreakdownModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        startupName={idea.startupName}
        evaluation={idea.evaluation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerTitleArea: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  expandedSection: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  aiQuoteTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  aiQuoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 8,
  },
  viewFullAnalysisBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  viewFullAnalysisText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  readMoreBtn: {
    paddingVertical: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  upvoteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upvoteText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
