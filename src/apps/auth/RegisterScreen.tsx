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
import { createUser, UserRecord } from '../../storage/db';

interface RegisterScreenProps {
  onRegister: (user: UserRecord) => void;
  onGoLogin: () => void;
}

export function RegisterScreen({ onRegister, onGoLogin }: RegisterScreenProps) {
  const { isDesktop, isMedium, isSmall } = useResponsive();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      if (!name || !email || !password) {
        setError('Preencha todos os campos.');
        return;
      }
      const user = await createUser(
        name.trim(),
        email.trim().toLowerCase(),
        password
      );
      onRegister(user);
    } catch (err: any) {
      if (err?.message === 'EMAIL_EXISTS') {
        setError('Este email ja esta cadastrado.');
        return;
      }
      setError('Falha ao criar conta.');
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
      fontSize: isDesktop ? 32 : isMedium ? 28 : isSmall ? 22 : 24,
      fontWeight: '800',
      marginBottom: 8,
    },
    subtitle: {
      color: 'rgba(226,232,240,0.7)',
      fontSize: isDesktop ? 15 : isMedium ? 14 : 12,
      marginBottom: 30,
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
      backgroundColor: '#22c55e',
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#052e1a',
      fontWeight: '800',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    error: {
      color: '#fecaca',
      marginTop: 10,
      fontWeight: '600',
    },
    footer: {
      marginTop: 18,
      alignItems: 'center',
    },
    footerText: {
      color: '#94a3b8',
      fontSize: 12,
    },
    footerLink: {
      color: '#7dd3fc',
      fontWeight: '700',
      marginTop: 6,
    },
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(34,197,94,0.12)',
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: 'rgba(34,197,94,0.4)',
      marginBottom: 18,
    },
    badgeText: {
      color: '#86efac',
      fontSize: 11,
      letterSpacing: 2,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
  });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Criar conta</Text>
        </View>
        <Text style={styles.title}>Novo cadastro</Text>
        <Text style={styles.subtitle}>
          Preencha seus dados para criar a conta
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
            placeholder="Crie uma senha"
            placeholderTextColor="#475569"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Criando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.error}>⚠ {error}</Text> : null}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ja possui conta?</Text>
          <TouchableOpacity onPress={onGoLogin}>
            <Text style={styles.footerLink}>Voltar para login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
