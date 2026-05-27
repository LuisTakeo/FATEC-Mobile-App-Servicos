import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';
import { MenuItem } from '../types/menu';

interface MenuSelectButtonsProps {
  label: string;
  items: MenuItem[];
  selectedValue: string;
  onSelectChange: (value: string) => void;
}

export const MenuSelectButtons: React.FC<MenuSelectButtonsProps> = ({
  label,
  items,
  selectedValue,
  onSelectChange,
}) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    container: {
      marginBottom: isDesktop ? 16 : isMedium ? 14 : isSmall ? 10 : 12,
      width: '100%',
    },
    label: {
      color: colors.text.primary,
      fontSize: isDesktop ? 14 : isMedium ? 13 : isSmall ? 11 : 12,
      fontWeight: '600',
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    pickerWrapper: {
      backgroundColor: colors.surface,
      borderRadius: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: isDesktop ? 10 : isMedium ? 8 : isSmall ? 6 : 8,
      marginBottom: isDesktop ? 12 : isMedium ? 10 : isSmall ? 8 : 10,
      overflow: 'hidden',
    },
    picker: {
      height: isDesktop ? 44 : isMedium ? 40 : isSmall ? 36 : 40,
      color: colors.text.primary,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: isDesktop ? 12 : isMedium ? 10 : isSmall ? 8 : 10,
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      paddingVertical: isDesktop ? 12 : isMedium ? 10 : isSmall ? 8 : 9,
      paddingHorizontal: isDesktop ? 10 : isMedium ? 8 : isSmall ? 6 : 8,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'hidden',
    },
    buttonSelected: {
      borderColor: 'rgba(255,255,255,0.3)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    itemImage: {
      width: '100%',
      height: isDesktop ? 100 : isMedium ? 90 : isSmall ? 70 : 80,
      borderRadius: isDesktop ? 8 : isMedium ? 7 : isSmall ? 5 : 6,
      marginBottom: isDesktop ? 8 : isMedium ? 6 : isSmall ? 4 : 5,
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
    buttonContent: {
      alignItems: 'center',
      width: '100%',
    },
    buttonLabel: {
      color: colors.text.primary,
      fontSize: isDesktop ? 13 : isMedium ? 12 : isSmall ? 10 : 11,
      fontWeight: '700',
      marginBottom: 4,
      textAlign: 'center',
    },
    priceText: {
      color: colors.text.secondary,
      fontSize: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      fontWeight: '600',
      marginBottom: 4,
    },
    accentBar: {
      width: '100%',
      height: 3,
      borderRadius: 2,
      marginTop: 4,
    },
  });

  const getButtonStyle = (item: MenuItem) => {
    const isSelected = selectedValue === item.value;
    return {
      backgroundColor: isSelected ? colors.surface : colors.surface,
      borderColor: isSelected ? item.accent : colors.border,
    };
  };

  const getImageSource = (image: any) => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onSelectChange}
          dropdownIconColor={colors.text.primary}
          style={styles.picker}
        >
          {items.map((item) => (
            <Picker.Item
              key={`${item.value}-picker`}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.buttonsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => onSelectChange(item.value)}
            style={[
              styles.button,
              getButtonStyle(item),
              selectedValue === item.value && styles.buttonSelected,
            ]}
          >
            <Image
              source={getImageSource(item.image)}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.buttonContent}>
              <Text style={styles.buttonLabel}>{item.label}</Text>
              <Text style={styles.priceText}>R$ {item.price.toFixed(2)}</Text>
              <View
                style={[
                  styles.accentBar,
                  { backgroundColor: item.accent },
                ]}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
