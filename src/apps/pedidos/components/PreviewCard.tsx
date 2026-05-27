import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';
import { MenuItem } from '../types/menu';

interface PreviewCardProps {
  item: MenuItem;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ item }) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    previewCard: {
      backgroundColor: colors.text.primary,
      borderRadius: isDesktop ? 36 : isMedium ? 32 : isSmall ? 20 : 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.borderLight,
      width: '100%',
    },
    previewImage: {
      width: '100%',
      height: isDesktop ? 300 : isMedium ? 240 : isSmall ? 140 : 180,
    },
    previewBadge: {
      position: 'absolute',
      top: isDesktop ? 18 : isMedium ? 16 : isSmall ? 10 : 14,
      right: isDesktop ? 18 : isMedium ? 16 : isSmall ? 10 : 14,
      paddingHorizontal: isDesktop ? 16 : isMedium ? 14 : isSmall ? 10 : 12,
      paddingVertical: isDesktop ? 10 : isMedium ? 9 : isSmall ? 6 : 8,
      borderRadius: 999,
    },
    previewBadgeText: {
      color: colors.text.primary,
      fontSize: isDesktop ? 17 : isMedium ? 15 : isSmall ? 11 : 13,
      fontWeight: '800',
    },
    previewTitle: {
      color: colors.text.dark,
      fontSize: isDesktop ? 26 : isMedium ? 22 : isSmall ? 16 : 18,
      fontWeight: '800',
      padding: isDesktop ? 24 : isMedium ? 20 : isSmall ? 12 : 16,
    },
  });

  const getImageSource = () => {
    if (typeof item.image === 'string') {
      return { uri: item.image };
    }
    return item.image;
  };

  return (
    <View style={styles.previewCard}>
      <Image source={getImageSource()} style={styles.previewImage} />
      <View style={[styles.previewBadge, { backgroundColor: item.accent }]}>
        <Text style={styles.previewBadgeText}>R$ {item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.previewTitle}>{item.label}</Text>
    </View>
  );
};
