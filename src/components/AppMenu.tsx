import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useResponsive } from '../styles/responsive';

export interface MenuAppItem {
  id: string;
  title: string;
  description: string;
  status: 'ready' | 'soon';
  accent: string;
}

interface AppMenuProps {
  items: MenuAppItem[];
  onSelect: (id: string) => void;
  userName?: string;
  onAccount?: () => void;
  onLogout?: () => void;
}

export const AppMenu: React.FC<AppMenuProps> = ({
  items,
  onSelect,
  userName,
  onAccount,
  onLogout,
}) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#0b1416',
    },
    content: {
      paddingHorizontal: isDesktop ? 48 : isMedium ? 36 : 20,
      paddingTop: isDesktop ? 72 : isMedium ? 60 : 40,
      paddingBottom: 60,
    },
    title: {
      color: '#e8fbff',
      fontSize: isDesktop ? 32 : isMedium ? 28 : isSmall ? 22 : 24,
      fontWeight: '800',
      marginBottom: 8,
    },
    subtitle: {
      color: 'rgba(232,251,255,0.75)',
      fontSize: isDesktop ? 16 : isMedium ? 15 : isSmall ? 12 : 13,
      marginBottom: isDesktop ? 30 : isMedium ? 24 : 18,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    userBadge: {
      backgroundColor: 'rgba(56,189,248,0.12)',
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: 'rgba(56,189,248,0.4)',
    },
    userText: {
      color: '#7dd3fc',
      fontSize: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    headerActions: {
      flexDirection: 'row',
      gap: 10,
    },
    actionButton: {
      backgroundColor: '#0f172a',
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#1e293b',
    },
    actionText: {
      color: '#e2e8f0',
      fontSize: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    grid: {
      gap: isDesktop ? 16 : isMedium ? 14 : 12,
    },
    card: {
      backgroundColor: '#122226',
      borderRadius: isDesktop ? 18 : isMedium ? 16 : 14,
      padding: isDesktop ? 20 : isMedium ? 18 : 14,
      borderWidth: 1,
      borderColor: '#1d343a',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardLeft: {
      flex: 1,
      marginRight: 12,
    },
    cardTitle: {
      color: '#e8fbff',
      fontSize: isDesktop ? 18 : isMedium ? 17 : isSmall ? 14 : 15,
      fontWeight: '700',
      marginBottom: 6,
    },
    cardDescription: {
      color: 'rgba(232,251,255,0.7)',
      fontSize: isDesktop ? 14 : isMedium ? 13 : isSmall ? 11 : 12,
    },
    accentBar: {
      width: 10,
      height: '100%',
      borderRadius: 8,
    },
    badge: {
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderRadius: 999,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.15)',
      alignSelf: 'flex-start',
      marginTop: 10,
    },
    badgeText: {
      color: 'rgba(232,251,255,0.85)',
      fontSize: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      fontWeight: '600',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
  });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Menu de Apps</Text>
        <Text style={styles.subtitle}>
          Selecione um projeto do semestre para abrir
        </Text>

        <View style={styles.headerRow}>
          <View style={styles.userBadge}>
            <Text style={styles.userText}>{userName ?? 'Usuario'}</Text>
          </View>
          <View style={styles.headerActions}>
            {onAccount ? (
              <TouchableOpacity style={styles.actionButton} onPress={onAccount}>
                <Text style={styles.actionText}>Conta</Text>
              </TouchableOpacity>
            ) : null}
            {onLogout ? (
              <TouchableOpacity style={styles.actionButton} onPress={onLogout}>
                <Text style={styles.actionText}>Sair</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.grid}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => onSelect(item.id)}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                {item.status === 'soon' && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Em breve</Text>
                  </View>
                )}
              </View>
              <View
                style={[styles.accentBar, { backgroundColor: item.accent }]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
