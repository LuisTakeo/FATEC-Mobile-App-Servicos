import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';
import { MenuItem } from '../types/menu';
import { PreviewCard } from './PreviewCard';

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  selectedValue: string;
  onSelectChange: (value: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  items,
  selectedValue,
  onSelectChange,
}) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();
  const selectedItem = items.find((item) => item.value === selectedValue) ?? items[0];

  const styles = StyleSheet.create({
    section: {
      marginBottom: isDesktop ? 40 : isMedium ? 28 : isSmall ? 16 : 18,
      width: '100%',
    },
    sectionTitle: {
      color: colors.text.primary,
      fontSize: isDesktop ? 24 : isMedium ? 22 : isSmall ? 16 : 18,
      fontWeight: '700',
      marginBottom: isDesktop ? 18 : isMedium ? 16 : isSmall ? 12 : 14,
    },
    pickerBox: {
      backgroundColor: colors.text.primary,
      borderRadius: isDesktop ? 28 : isMedium ? 24 : isSmall ? 16 : 18,
      overflow: 'hidden',
      marginBottom: isDesktop ? 20 : isMedium ? 18 : isSmall ? 12 : 14,
      width: '100%',
    },
    picker: {
      height: isDesktop ? 68 : isMedium ? 64 : isSmall ? 48 : 56,
      color: colors.text.dark,
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onSelectChange}
          dropdownIconColor={colors.text.dark}
          style={styles.picker}
        >
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={`${item.label} - R$ ${item.price.toFixed(2)}`}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      <PreviewCard item={selectedItem} />
    </View>
  );
};
