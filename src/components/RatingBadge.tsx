import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingBadgeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ score, size = 'medium' }) => {
  let bgColor = '#10B981'; // Green
  let textColor = '#FFFFFF';
  let label = 'Strong';

  if (score >= 85) {
    bgColor = '#10B981'; // Green
    label = 'Exceptional';
  } else if (score >= 75) {
    bgColor = '#3B82F6'; // Blue
    label = 'Strong';
  } else if (score >= 60) {
    bgColor = '#F59E0B'; // Amber
    label = 'Moderate';
  } else {
    bgColor = '#EF4444'; // Red
    label = 'Needs Work';
  }

  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor },
        isSmall && styles.containerSmall,
        isLarge && styles.containerLarge,
      ]}
    >
      <Text style={[styles.text, isSmall && styles.textSmall, isLarge && styles.textLarge]}>
        🤖 {score}/100
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  containerLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  textSmall: {
    fontSize: 11,
  },
  textLarge: {
    fontSize: 18,
  },
});
