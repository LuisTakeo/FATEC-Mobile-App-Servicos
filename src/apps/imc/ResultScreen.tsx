import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { styles } from './styles';
import type { IMCResultPayload } from './viewModel/IMCViewModel';

interface ResultScreenProps {
  data: IMCResultPayload;
  onBack: () => void;
}

export function ResultScreen({ data, onBack }: ResultScreenProps) {
  const { imc, classification, weight, height } = data;

  const clampedIMC = Math.min(Math.max(imc, 10), 45);
  const pct = ((clampedIMC - 10) / 35) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1A" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{classification.emoji}</Text>
          <Text style={styles.title}>Seu resultado</Text>
          <Text style={styles.subtitle}>
            {weight} kg · {height} m
          </Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.imcCircle, { borderColor: classification.color }]}
          >
            <Text style={[styles.imcValue, { color: classification.color }]}>
              {imc}
            </Text>
            <Text style={styles.imcUnit}>IMC</Text>
          </View>

          <Text style={[styles.classLabel, { color: classification.color }]}>
            {classification.label}
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={styles.progressGradient} />
              <View
                style={[
                  styles.progressThumb,
                  { left: `${pct}%`, borderColor: classification.color },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabelText}>Baixo</Text>
              <Text style={styles.progressLabelText}>Normal</Text>
              <Text style={styles.progressLabelText}>Alto</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoValue}>{weight}</Text>
            <Text style={styles.infoKey}>Peso (kg)</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoValue}>{height}</Text>
            <Text style={styles.infoKey}>Altura (m)</Text>
          </View>
          <View style={[styles.infoCard, { borderColor: classification.color }]}
          >
            <Text style={[styles.infoValue, { color: classification.color }]}>
              {imc}
            </Text>
            <Text style={styles.infoKey}>IMC</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>← Calcular novamente</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
