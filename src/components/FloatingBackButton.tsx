import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FloatingBackButtonProps {
  onPress: () => void;
  label?: string;
}

export const FloatingBackButton: React.FC<FloatingBackButtonProps> = ({
  onPress,
  label = 'Voltar ao menu',
}) => {
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 44,
      left: 16,
      zIndex: 10,
    },
    button: {
      backgroundColor: 'rgba(18, 15, 32, 0.9)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    text: {
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 12,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};
