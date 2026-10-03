import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Evaluation } from '../types/idea';
import { useTheme } from '../context/ThemeContext';
import { RatingBadge } from './RatingBadge';

interface ScoreBreakdownModalProps {
  visible: boolean;
  onClose: () => void;
  startupName: string;
  evaluation: Evaluation;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  visible,
  onClose,
  startupName,
  evaluation,
}) => {
  const { colors } = useTheme();

  const renderMetricBar = (label: string, score: number) => {
    let barColor = colors.primary;
    if (score >= 85) barColor = colors.success;
    else if (score < 70) barColor = colors.warning;

    return (
      <View style={styles.metricRow} key={label}>
        <View style={styles.metricHeader}>
          <Text style={[styles.metricLabel, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>{score}%</Text>
        </View>
        <View style={[styles.barBackground, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.barFill,
              { width: `${Math.min(100, Math.max(0, score))}%`, backgroundColor: barColor },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>🤖 AI Startup Evaluation</Text>
              <Text style={[styles.startupName, { color: colors.primary }]}>{startupName}</Text>
            </View>

            <View style={[styles.scoreHero, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.scoreHeroLabel, { color: colors.textSecondary }]}>OVERALL RATING</Text>
              <RatingBadge score={evaluation.score} size="large" />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Score Breakdown</Text>
              {renderMetricBar('Problem Clarity', evaluation.problemClarity)}
              {renderMetricBar('Market Potential', evaluation.marketPotential)}
              {renderMetricBar('Originality', evaluation.originality)}
              {renderMetricBar('Feasibility', evaluation.feasibility)}
            </View>

            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.success }]}>💪 Strengths</Text>
                {evaluation.strengths.map((str, idx) => (
                  <View style={styles.bulletRow} key={idx}>
                    <Text style={[styles.bulletPoint, { color: colors.success }]}>✓</Text>
                    <Text style={[styles.bulletText, { color: colors.text }]}>{str}</Text>
                  </View>
                ))}
              </View>
            )}

            {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.warning }]}>⚠️ Considerations</Text>
                {evaluation.weaknesses.map((weak, idx) => (
                  <View style={styles.bulletRow} key={idx}>
                    <Text style={[styles.bulletPoint, { color: colors.warning }]}>!</Text>
                    <Text style={[styles.bulletText, { color: colors.text }]}>{weak}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>💡 AI Feedback Summary</Text>
              <View style={[styles.feedbackBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.feedbackText, { color: colors.textSecondary }]}>
                  "{evaluation.feedback}"
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.primary }]} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  startupName: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  scoreHero: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  scoreHeroLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  metricRow: {
    marginBottom: 10,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  barBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontWeight: '800',
    marginRight: 8,
    fontSize: 14,
  },
  bulletText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  feedbackBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  closeButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
