import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  productLabel: string;
  drinkLabel: string;
  total: number;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  productLabel,
  drinkLabel,
  total,
}) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: isDesktop ? 40 : isMedium ? 30 : 20,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: isDesktop ? 20 : isMedium ? 18 : isSmall ? 14 : 16,
      padding: isDesktop ? 32 : isMedium ? 28 : isSmall ? 20 : 24,
      width: '100%',
      maxWidth: isDesktop ? 450 : 350,
      borderWidth: 1,
      borderColor: colors.borderLight,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 10,
    },
    title: {
      color: colors.accent.secondary,
      fontSize: isDesktop ? 22 : isMedium ? 20 : isSmall ? 16 : 18,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: isDesktop ? 24 : isMedium ? 20 : isSmall ? 14 : 16,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    contentSection: {
      marginBottom: isDesktop ? 24 : isMedium ? 20 : isSmall ? 14 : 16,
      paddingBottom: isDesktop ? 24 : isMedium ? 20 : isSmall ? 14 : 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionLabel: {
      color: colors.text.secondary,
      fontSize: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    itemText: {
      color: colors.text.primary,
      fontSize: isDesktop ? 16 : isMedium ? 15 : isSmall ? 13 : 14,
      fontWeight: '700',
    },
    totalSection: {
      marginBottom: isDesktop ? 28 : isMedium ? 24 : isSmall ? 16 : 20,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      padding: isDesktop ? 16 : isMedium ? 14 : isSmall ? 10 : 12,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    totalLabel: {
      color: colors.text.secondary,
      fontSize: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    totalValue: {
      color: colors.accent.primary,
      fontSize: isDesktop ? 28 : isMedium ? 26 : isSmall ? 22 : 24,
      fontWeight: '900',
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: isDesktop ? 12 : isMedium ? 10 : isSmall ? 8 : 10,
    },
    button: {
      flex: 1,
      paddingVertical: isDesktop ? 14 : isMedium ? 12 : isSmall ? 10 : 11,
      borderRadius: isDesktop ? 10 : isMedium ? 9 : isSmall ? 8 : 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: {
      backgroundColor: colors.accent.primary,
    },
    primaryButtonText: {
      color: colors.text.dark,
      fontSize: isDesktop ? 14 : isMedium ? 13 : isSmall ? 11 : 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>✓ Pedido Confirmado!</Text>

          <View style={styles.contentSection}>
            <Text style={styles.sectionLabel}>Prato Principal</Text>
            <Text style={styles.itemText}>{productLabel}</Text>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.sectionLabel}>Bebida</Text>
            <Text style={styles.itemText}>{drinkLabel}</Text>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Valor Total</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onClose}
            >
              <Text style={styles.primaryButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
