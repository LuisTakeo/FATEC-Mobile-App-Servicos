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
import { getUserByEmail, UserRecord } from '../../storage/db';

interface LoginScreenProps {
  onLogin: (user: UserRecord) => void;
  onGoRegister: () => void;
}

export function LoginScreen({ onLogin, onGoRegister }: LoginScreenProps) {
  const { isDesktop, isMedium, isSmall } = useResponsive();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      if (!email || !password) {
        setError('Preencha email e senha.');
        return;
      }
      const user = await getUserByEmail(email.trim().toLowerCase());
      if (!user || user.password !== password) {
        setError('Credenciais invalidas.');
        return;
      }
      onLogin(user);
    } catch (err) {
      setError('Falha ao acessar o banco.');
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
      backgroundColor: '#38bdf8',
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#0f172a',
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
      color: '#38bdf8',
      fontWeight: '700',
      marginTop: 6,
    },
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(56,189,248,0.12)',
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: 'rgba(56,189,248,0.4)',
      marginBottom: 18,
    },
    badgeText: {
      color: '#7dd3fc',
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
          <Text style={styles.badgeText}>Acesso</Text>
        </View>
        <Text style={styles.title}>Bem-vindo de volta</Text>
        <Text style={styles.subtitle}>
          Entre para acessar seus aplicativos do semestre
        </Text>

        <View style={styles.card}>
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
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.error}>⚠ {error}</Text> : null}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda nao tem conta?</Text>
          <TouchableOpacity onPress={onGoRegister}>
            <Text style={styles.footerLink}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
