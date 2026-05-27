import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useResponsive } from '../styles/responsive';

interface PlaceholderScreenProps {
  title: string;
  onBack: () => void;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  title,
  onBack,
}) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#0b1416',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: isDesktop ? 48 : isMedium ? 36 : 20,
    },
    title: {
      color: '#e8fbff',
      fontSize: isDesktop ? 26 : isMedium ? 24 : isSmall ? 20 : 22,
      fontWeight: '800',
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      color: 'rgba(232,251,255,0.75)',
      fontSize: isDesktop ? 15 : isMedium ? 14 : isSmall ? 12 : 13,
      marginBottom: 24,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#22c55e',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 12,
    },
    buttonText: {
      color: '#052e1a',
      fontWeight: '700',
      fontSize: isDesktop ? 14 : isMedium ? 13 : isSmall ? 11 : 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>
        Este app esta em construcao. Vou te ajudar a criar em seguida.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onBack}>
        <Text style={styles.buttonText}>Voltar ao menu</Text>
      </TouchableOpacity>
    </View>
  );
};
