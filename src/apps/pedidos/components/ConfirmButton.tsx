import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';

interface ConfirmButtonProps {
  onPress: () => void;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onPress }) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.accent.primary,
      borderRadius: isDesktop ? 28 : isMedium ? 24 : isSmall ? 16 : 18,
      paddingVertical: isDesktop ? 24 : isMedium ? 20 : isSmall ? 12 : 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 6,
      width: '100%',
    },
    buttonText: {
      color: colors.text.primary,
      fontSize: isDesktop ? 21 : isMedium ? 19 : isSmall ? 15 : 17,
      fontWeight: '800',
    },
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.buttonText}>Confirmar pedido</Text>
    </TouchableOpacity>
  );
};
