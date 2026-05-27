import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';
import { MenuItem } from '../types/menu';

interface TotalCardProps {
  product: MenuItem;
  drink: MenuItem;
  total: number;
}

export const TotalCard: React.FC<TotalCardProps> = ({ product, drink, total }) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    totalCard: {
      backgroundColor: colors.accent.teal,
      borderRadius: isDesktop ? 36 : isMedium ? 32 : isSmall ? 20 : 24,
      padding: isDesktop ? 32 : isMedium ? 28 : isSmall ? 16 : 20,
      marginTop: 4,
      marginBottom: isDesktop ? 40 : isMedium ? 32 : isSmall ? 20 : 24,
      width: '100%',
    },
    totalLabel: {
      color: colors.text.muted,
      fontSize: isDesktop ? 17 : isMedium ? 15 : isSmall ? 11 : 13,
      textTransform: 'uppercase',
      fontWeight: '700',
    },
    totalValue: {
      color: colors.text.primary,
      fontSize: isDesktop ? 32 : isMedium ? 26 : isSmall ? 18 : 22,
      fontWeight: '800',
      marginTop: 8,
    },
    totalDivider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginVertical: isDesktop ? 20 : isMedium ? 18 : isSmall ? 12 : 16,
    },
    totalPrice: {
      color: colors.accent.tealLight,
      fontSize: isDesktop ? 28 : isMedium ? 24 : isSmall ? 18 : 20,
      fontWeight: '800',
    },
  });

  return (
    <View style={styles.totalCard}>
      <Text style={styles.totalLabel}>Resumo do pedido</Text>
      <Text style={styles.totalValue}>
        {product.label} + {drink.label}
      </Text>
      <View style={styles.totalDivider} />
      <Text style={styles.totalPrice}>Total: R$ {total.toFixed(2)}</Text>
    </View>
  );
};
