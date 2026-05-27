import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';
import { MenuItem } from '../types/menu';

interface SummaryCardProps {
  product: MenuItem;
  drink: MenuItem;
  total: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ product, drink, total }) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    summaryCard: {
      backgroundColor: colors.surface,
      borderRadius: isDesktop ? 36 : isMedium ? 32 : isSmall ? 20 : 24,
      padding: isDesktop ? 32 : isMedium ? 28 : isSmall ? 16 : 20,
      marginBottom: isDesktop ? 40 : isMedium ? 32 : isSmall ? 20 : 24,
      borderWidth: 1,
      borderColor: colors.border,
      width: '100%',
    },
    summaryLabel: {
      color: colors.accent.primary,
      fontSize: isDesktop ? 17 : isMedium ? 15 : isSmall ? 11 : 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    summaryText: {
      color: colors.text.primary,
      fontSize: isDesktop ? 32 : isMedium ? 26 : isSmall ? 18 : 22,
      fontWeight: '800',
    },
    summaryPrice: {
      color: colors.accent.success,
      fontSize: isDesktop ? 26 : isMedium ? 22 : isSmall ? 16 : 18,
      fontWeight: '700',
      marginTop: 10,
    },
  });

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>Pedido rapido</Text>
      <Text style={styles.summaryText}>
        {product.label} + {drink.label}
      </Text>
      <Text style={styles.summaryPrice}>Total: R$ {total.toFixed(2)}</Text>
    </View>
  );
};
