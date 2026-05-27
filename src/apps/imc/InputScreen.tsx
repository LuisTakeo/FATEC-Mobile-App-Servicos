import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { styles } from './styles';
import { useIMCViewModel } from './viewModel/IMCViewModel';
import type { IMCResultPayload } from './viewModel/IMCViewModel';
import type { ImcHistoryRecord } from '../../storage/db';

interface InputScreenProps {
  onResult: (payload: IMCResultPayload) => void;
  history?: ImcHistoryRecord[];
}

export function InputScreen({ onResult, history }: InputScreenProps) {
  const vm = useIMCViewModel();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1A" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>IMC</Text>
            </View>
          </View>
          <Text style={styles.title}>Calculadora</Text>
          <Text style={styles.subtitle}>Descubra seu indice de{`\n`}massa corporal</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>PESO</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ex: 70"
              placeholderTextColor="#4B5563"
              keyboardType="decimal-pad"
              value={vm.weight}
              onChangeText={vm.setWeight}
              selectionColor="#A78BFA"
            />
            <View style={styles.unitBadge}>
              <Text style={styles.unitText}>kg</Text>
            </View>
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>ALTURA</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ex: 1.75"
              placeholderTextColor="#4B5563"
              keyboardType="decimal-pad"
              value={vm.height}
              onChangeText={vm.setHeight}
              selectionColor="#A78BFA"
            />
            <View style={styles.unitBadge}>
              <Text style={styles.unitText}>m</Text>
            </View>
          </View>

          {vm.error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {vm.error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const result = vm.handleCalculate();
              if (result) {
                onResult(result);
                vm.reset();
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Calcular IMC →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scaleCard}>
          <Text style={styles.scaleTitle}>Tabela de referencia</Text>
          {[
            { range: '< 18.5', label: 'Abaixo do peso', color: '#60A5FA' },
            { range: '18.5-24.9', label: 'Peso normal', color: '#34D399' },
            { range: '25-29.9', label: 'Sobrepeso', color: '#FBBF24' },
            { range: '30-34.9', label: 'Obesidade grau I', color: '#F97316' },
            { range: '35+', label: 'Obesidade grau II+', color: '#EF4444' },
          ].map((item) => (
            <View key={item.range} style={styles.scaleRow}>
              <View style={[styles.scaleBar, { backgroundColor: item.color }]} />
              <Text style={styles.scaleRange}>{item.range}</Text>
              <Text style={styles.scaleLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {history ? (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Historico de calculos</Text>
            {history.length === 0 ? (
              <Text style={styles.historyEmpty}>Nenhum calculo salvo ainda.</Text>
            ) : (
              history.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.historyRow,
                    index === history.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Text style={styles.historyText}>
                    IMC {item.imc.toFixed(2)} - {item.classification}
                  </Text>
                  <Text style={styles.historyMeta}>
                    {item.weight} kg · {item.height} m ·{' '}
                    {new Date(item.createdAt).toLocaleString('pt-BR')}
                  </Text>
                </View>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
