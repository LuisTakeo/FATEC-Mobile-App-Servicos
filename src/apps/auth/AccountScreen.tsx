import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useResponsive } from '../../styles/responsive';
import { updateUser, UserRecord } from '../../storage/db';

interface AccountScreenProps {
  user: UserRecord;
  onSave: (user: UserRecord) => void;
  onBack: () => void;
}

export function AccountScreen({ user, onSave, onBack }: AccountScreenProps) {
  const { isDesktop, isMedium, isSmall } = useResponsive();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      if (!name || !email || !password) {
        setError('Preencha todos os campos.');
        return;
      }
      const updated = await updateUser(
        user.id,
        name.trim(),
        email.trim().toLowerCase(),
        password
      );
      if (!updated) {
        setError('Usuario nao encontrado.');
        return;
      }
      onSave(updated);
    } catch (err) {
      setError('Falha ao atualizar conta.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#06090f',
    },
    content: {
      paddingHorizontal: isDesktop ? 50 : isMedium ? 40 : 24,
      paddingTop: isDesktop ? 80 : isMedium ? 70 : 60,
      paddingBottom: 60,
    },
    title: {
      color: '#e2e8f0',
      fontSize: isDesktop ? 30 : isMedium ? 26 : isSmall ? 22 : 24,
      fontWeight: '800',
      marginBottom: 10,
    },
    subtitle: {
      color: 'rgba(226,232,240,0.7)',
      fontSize: isDesktop ? 14 : isMedium ? 13 : 12,
      marginBottom: 24,
    },
    card: {
      backgroundColor: '#0f172a',
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: '#1e293b',
    },
    inputLabel: {
      color: '#94a3b8',
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontWeight: '700',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#020617',
      color: '#e2e8f0',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: '#1e293b',
      marginBottom: 16,
    },
    button: {
      backgroundColor: '#fbbf24',
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#422006',
      fontWeight: '800',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    error: {
      color: '#fecaca',
      marginTop: 10,
      fontWeight: '600',
    },
    back: {
      marginTop: 18,
      alignItems: 'center',
    },
    backText: {
      color: '#7dd3fc',
      fontWeight: '700',
    },
  });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Minha conta</Text>
        <Text style={styles.subtitle}>
          Atualize seus dados de acesso e perfil
        </Text>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#475569"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@exemplo.com"
            placeholderTextColor="#475569"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua senha"
            placeholderTextColor="#475569"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Salvando...' : 'Salvar alteracoes'}
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.error}>⚠ {error}</Text> : null}
        </View>

        <View style={styles.back}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backText}>Voltar para o menu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
