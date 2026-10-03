import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SortOption } from '../types/idea';
import { useTheme } from '../context/ThemeContext';

interface SortSelectorProps {
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export const SortSelector: React.FC<SortSelectorProps> = ({ currentSort, onSelectSort }) => {
  const { colors } = useTheme();

  const options: { id: SortOption; label: string; icon: string }[] = [
    { id: 'rating', label: 'AI Score', icon: '⭐' },
    { id: 'votes', label: 'Votes', icon: '👍' },
    { id: 'newest', label: 'Newest', icon: '🕐' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Sort by:</Text>
      <View style={styles.buttonsRow}>
        {options.map((opt) => {
          const isActive = currentSort === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.button,
                { backgroundColor: isActive ? colors.primary : colors.card, borderColor: colors.border },
              ]}
              onPress={() => onSelectSort(opt.id)}
            >
              <Text style={[styles.buttonText, { color: isActive ? '#FFFFFF' : colors.text }]}>
                {opt.icon} {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
