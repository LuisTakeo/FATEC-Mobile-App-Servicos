import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';

interface HeroProps {
  contentPadding: number;
}

export const Hero: React.FC<HeroProps> = ({ contentPadding }) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    hero: {
      marginBottom: isDesktop ? 48 : isMedium ? 36 : isSmall ? 20 : 24,
      width: '100%',
    },
    kicker: {
      color: colors.accent.secondary,
      fontSize: isDesktop ? 18 : isMedium ? 16 : isSmall ? 12 : 14,
      fontWeight: '700',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: 10,
    },
    title: {
      color: colors.text.primary,
      fontSize: isDesktop ? 48 : isMedium ? 42 : isSmall ? 28 : 34,
      fontWeight: '800',
      lineHeight: isDesktop ? 56 : isMedium ? 50 : isSmall ? 32 : 40,
    },
    subtitle: {
      color: colors.text.secondary,
      fontSize: isDesktop ? 20 : isMedium ? 18 : isSmall ? 14 : 16,
      lineHeight: isDesktop ? 32 : isMedium ? 28 : isSmall ? 20 : 24,
      marginTop: 12,
    },
  });

  return (
    <View style={styles.hero}>
      <Text style={styles.kicker}>Pedido rapido</Text>
      <Text style={styles.title}>Monte seu combo em poucos toques</Text>
      <Text style={styles.subtitle}>
        Escolha um produto, uma bebida, confira o total e confirme o pedido.
      </Text>
    </View>
  );
};
