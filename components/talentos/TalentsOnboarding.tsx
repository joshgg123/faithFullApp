import { ONBOARDING_QUESTIONS } from '@/components/talentos/OnboardingQuestions';
import { appColors } from '@/constants/colors';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  onComplete: (interests: string[]) => void;
};

export function TalentsOnboarding({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedTags, setCollectedTags] = useState<string[]>([]);

  const handleSelectOption = (tags: string[]) => {
  const nextTags = [...collectedTags, ...tags];

  if (currentStep + 1 < ONBOARDING_QUESTIONS.length) {
    setCollectedTags(nextTags);
    setCurrentStep((prev) => prev + 1);
    return;
  }

  const uniqueTags = [...new Set(nextTags)];

  onComplete(uniqueTags);
};

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Indicador de progreso (Ej: 1/10) */}
        <Text style={styles.progressText}>
          {currentStep + 1}/{ONBOARDING_QUESTIONS.length}
        </Text>
        
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100}%` }
            ]} 
          />
        </View>

        {/* Título de la pregunta */}
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {/* Opciones */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionButton}
              onPress={() => handleSelectOption(option.tags)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: appColors.border,
    borderRadius: 4,
    marginBottom: 40,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: appColors.primary,
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: appColors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: appColors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.border,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: appColors.text,
    fontWeight: '500',
  }
});