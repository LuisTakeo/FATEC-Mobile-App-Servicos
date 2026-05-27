import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';
import { MenuItem } from '../types/menu';

interface CompactMenuSelectProps {
  label: string;
  items: MenuItem[];
  selectedValue: string;
  onSelectChange: (value: string) => void;
  selectedItem: MenuItem;
}

export const CompactMenuSelect: React.FC<CompactMenuSelectProps> = ({
  label,
  items,
  selectedValue,
  onSelectChange,
  selectedItem,
}) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const styles = StyleSheet.create({
    container: {
      marginBottom: isDesktop ? 12 : isMedium ? 10 : isSmall ? 8 : 10,
      width: '100%',
    },
    label: {
      color: colors.text.primary,
      fontSize: isDesktop ? 14 : isMedium ? 13 : isSmall ? 11 : 12,
      fontWeight: '600',
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    pickerWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: isDesktop ? 14 : isMedium ? 12 : isSmall ? 10 : 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: isDesktop ? 12 : isMedium ? 10 : isSmall ? 8 : 10,
      overflow: 'hidden',
    },
    picker: {
      flex: 1,
      height: isDesktop ? 48 : isMedium ? 44 : isSmall ? 40 : 44,
      color: colors.text.primary,
    },
    priceTag: {
      backgroundColor: selectedItem.accent,
      paddingHorizontal: isDesktop ? 10 : isMedium ? 9 : isSmall ? 7 : 8,
      paddingVertical: isDesktop ? 6 : isMedium ? 5 : isSmall ? 4 : 5,
      borderRadius: 8,
      marginLeft: 8,
    },
    priceText: {
      color: colors.text.primary,
      fontSize: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      fontWeight: '800',
    },
  });

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
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>R$ {selectedItem.price.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};
