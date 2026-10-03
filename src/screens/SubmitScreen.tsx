import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { evaluateIdea } from '../services/api';
import { saveIdea } from '../services/storage';
import { Evaluation, Idea } from '../types/idea';
import { ScoreBreakdownModal } from '../components/ScoreBreakdownModal';
import { Toast } from '../components/Toast';

interface SubmitScreenProps {
  onNavigateToFeed: () => void;
}

export const SubmitScreen: React.FC<SubmitScreenProps> = ({ onNavigateToFeed }) => {
  const { colors } = useTheme();

  const [startupName, setStartupName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('🤖 Understanding your problem statement...');
  const [evaluationResult, setEvaluationResult] = useState<Evaluation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const isValid = startupName.trim().length >= 2 && tagline.trim().length >= 5 && description.trim().length >= 15;

  const handleEvaluate = async () => {
    if (!isValid) return;

    setLoading(true);
    setLoadingStep('🤖 Connecting to Gemini 2.5 Flash AI...');

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev.includes('Gemini')) return '📊 Evaluating market potential & originality...';
        if (prev.includes('market')) return '💡 Calculating feasibility and strengths...';
        return '🚀 Finalizing AI score report...';
      });
    }, 1500);

    try {
      const evalData = await evaluateIdea(startupName.trim(), tagline.trim(), description.trim());
      clearInterval(stepInterval);
      setLoading(false);

      // Create new Idea object
      const newIdea: Idea = {
        id: `idea-${Date.now()}`,
        startupName: startupName.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        evaluation: evalData,
        votes: 1, // Author start vote
        createdAt: new Date().toISOString(),
      };

      await saveIdea(newIdea);
      setEvaluationResult(evalData);
      setModalVisible(true);
      showToast('🚀 Idea evaluated & saved!');
    } catch (e) {
      clearInterval(stepInterval);
      setLoading(false);
      showToast('❌ Failed to evaluate idea. Please try again.');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    // Reset form
    setStartupName('');
    setTagline('');
    setDescription('');
    onNavigateToFeed();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>Submit Your Startup Idea 💡</Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Get instant multi-dimensional evaluation powered by Gemini 2.5 Flash AI.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Startup Name */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.text }]}>Startup Name</Text>
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {startupName.length}/50
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="e.g. QuickKart, SkillFlow"
              placeholderTextColor={colors.textSecondary}
              value={startupName}
              onChangeText={setStartupName}
              maxLength={50}
            />
          </View>

          {/* Tagline */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.text }]}>Tagline / Elevator Pitch</Text>
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {tagline.length}/100
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="e.g. Groceries delivered in under 10 minutes"
              placeholderTextColor={colors.textSecondary}
              value={tagline}
              onChangeText={setTagline}
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.text }]}>Problem & Solution Description</Text>
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {description.length}/1000
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Describe the target audience, specific problem solved, and core innovation..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
          </View>

          {/* Evaluate Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: isValid ? colors.primary : colors.border },
            ]}
            onPress={handleEvaluate}
            disabled={!isValid || loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Analyzing Idea...</Text>
              </View>
            ) : (
              <Text style={[styles.submitBtnText, { color: isValid ? '#FFFFFF' : colors.textSecondary }]}>
                Evaluate Idea 🚀
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={[styles.loadingOverlay, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingStepText, { color: colors.text }]}>{loadingStep}</Text>
          </View>
        )}
      </ScrollView>

      {evaluationResult && (
        <ScoreBreakdownModal
          visible={modalVisible}
          onClose={handleModalClose}
          startupName={startupName}
          evaluation={evaluationResult}
        />
      )}

      <Toast message={toastMessage} visible={toastVisible} onHide={() => setToastVisible(false)} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  heroSection: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  charCount: {
    fontSize: 11,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontWeight: '800',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingOverlay: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  loadingStepText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
