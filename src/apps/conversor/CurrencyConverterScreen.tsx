import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SQLite from 'expo-sqlite';

const currencies = [
  {
    code: 'BRL',
    label: 'Real (BRL)',
    flag: 'https://flagcdn.com/w40/br.png',
  },
  {
    code: 'USD',
    label: 'Dolar (USD)',
    flag: 'https://flagcdn.com/w40/us.png',
  },
  {
    code: 'EUR',
    label: 'Euro (EUR)',
    flag: 'https://flagcdn.com/w40/eu.png',
  },
  {
    code: 'GBP',
    label: 'Libra (GBP)',
    flag: 'https://flagcdn.com/w40/gb.png',
  },
];

const rates: Record<string, number> = {
  BRL: 1,
  USD: 5.1,
  EUR: 5.5,
  GBP: 6.4,
};

interface HistoryItem {
  id: number;
  amount: number;
  fromCode: string;
  toCode: string;
  result: number;
  createdAt: string;
}

const db = Platform.OS === 'web' ? null : SQLite.openDatabase('converter.db');

export function CurrencyConverterScreen() {
  const [amount, setAmount] = useState('');
  const [fromCode, setFromCode] = useState('BRL');
  const [toCode, setToCode] = useState('USD');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const currencyMap = useMemo(() => {
    return currencies.reduce<Record<string, string>>((acc, item) => {
      acc[item.code] = item.label;
      return acc;
    }, {});
  }, []);

  const formatter = useCallback((value: number, code: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: code,
    }).format(value);
  }, []);

  useEffect(() => {
    if (!db) return;
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS conversions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, fromCode TEXT, toCode TEXT, result REAL, createdAt TEXT)'
      );
    });
  }, []);

  const loadHistory = useCallback(() => {
    if (!db) return;
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM conversions ORDER BY id DESC LIMIT 10',
        [],
        (_, { rows }) => {
          setHistory(rows._array as HistoryItem[]);
        }
      );
    });
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleConvert = () => {
    const numeric = parseFloat(amount.replace(',', '.'));
    if (!amount || Number.isNaN(numeric)) {
      setError('Digite um valor valido.');
      return;
    }
    if (fromCode === toCode) {
      setError('Escolha moedas diferentes.');
      return;
    }
    const base = numeric / rates[fromCode];
    const converted = base * rates[toCode];
    setResult(converted);
    setError('');

    const newItem: HistoryItem = {
      id: Date.now(),
      amount: numeric,
      fromCode,
      toCode,
      result: converted,
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => [newItem, ...prev].slice(0, 10));

    if (db) {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO conversions (amount, fromCode, toCode, result, createdAt) VALUES (?, ?, ?, ?, ?)',
          [numeric, fromCode, toCode, converted, newItem.createdAt],
          () => loadHistory()
        );
      });
    }
  };

  const handleReset = () => {
    setAmount('');
    setFromCode('BRL');
    setToCode('USD');
    setResult(null);
    setError('');
  };

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
    setResult(null);
  };

  const renderCurrencyPicker = (
    label: string,
    selected: string,
    onChange: (value: string) => void
  ) => (
    <View style={styles.pickerBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.pickerRow}>
        <Image
          source={{ uri: currencies.find((c) => c.code === selected)?.flag }}
          style={styles.flag}
        />
        <Picker
          selectedValue={selected}
          onValueChange={onChange}
          style={styles.picker}
          dropdownIconColor="#E6FFFB"
        >
          {currencies.map((currency) => (
            <Picker.Item
              key={currency.code}
              label={currency.label}
              value={currency.code}
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Conversor de Moedas</Text>
        <Text style={styles.subtitle}>
          Converta valores usando taxas fixas e salve seu historico
        </Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Valor</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 100"
            placeholderTextColor="#5EEAD4"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.pickerGrid}>
            {renderCurrencyPicker('Moeda de origem', fromCode, setFromCode)}
            {renderCurrencyPicker('Moeda de destino', toCode, setToCode)}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
              <Text style={styles.swapText}>Inverter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>Limpar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
            <Text style={styles.convertText}>Converter</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Resultado</Text>
          <Text style={styles.resultValue}>
            {result !== null
              ? formatter(result, toCode)
              : 'Digite um valor e converta'}
          </Text>
          <Text style={styles.resultMeta}>
            {result !== null
              ? `${formatter(parseFloat(amount || '0'), fromCode)} -> ${currencyMap[toCode]}`
              : 'Taxas fixas definidas no codigo'}
          </Text>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Historico</Text>
          {history.length === 0 ? (
            <Text style={styles.historyEmpty}>Nenhuma conversao ainda.</Text>
          ) : (
            history.map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <View>
                  <Text style={styles.historyValue}>
                    {formatter(item.amount, item.fromCode)} ->{' '}
                    {formatter(item.result, item.toCode)}
                  </Text>
                  <Text style={styles.historyMeta}>
                    {currencyMap[item.fromCode]} para {currencyMap[item.toCode]}
                  </Text>
                </View>
                <Text style={styles.historyTime}>
                  {new Date(item.createdAt).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#042f2e',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#E6FFFB',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(94,234,212,0.8)',
    fontSize: 13,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#0f766e',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#14b8a6',
  },
  fieldLabel: {
    color: '#e0f2f1',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#083344',
    color: '#E6FFFB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#0f766e',
    marginBottom: 16,
    fontSize: 16,
  },
  pickerGrid: {
    gap: 14,
  },
  pickerBlock: {
    backgroundColor: '#083344',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0f766e',
    padding: 8,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  picker: {
    flex: 1,
    color: '#E6FFFB',
  },
  flag: {
    width: 32,
    height: 24,
    borderRadius: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  swapButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5eead4',
    paddingVertical: 10,
    alignItems: 'center',
  },
  swapText: {
    color: '#5eead4',
    fontWeight: '700',
  },
  resetButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  resetText: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  convertButton: {
    backgroundColor: '#5eead4',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  convertText: {
    color: '#042f2e',
    fontWeight: '800',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  errorText: {
    color: '#fecaca',
    marginTop: 10,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  resultLabel: {
    color: '#67e8f9',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: 11,
  },
  resultValue: {
    color: '#e0f2fe',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  resultMeta: {
    color: 'rgba(226,232,240,0.7)',
    fontSize: 12,
    marginTop: 8,
  },
  historyCard: {
    marginTop: 24,
    backgroundColor: '#134e4a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#115e59',
  },
  historyTitle: {
    color: '#99f6e4',
    fontWeight: '800',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 12,
  },
  historyEmpty: {
    color: 'rgba(226,232,240,0.7)',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyValue: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 13,
  },
  historyMeta: {
    color: 'rgba(226,232,240,0.7)',
    fontSize: 11,
  },
  historyTime: {
    color: '#94a3b8',
    fontSize: 11,
  },
});
