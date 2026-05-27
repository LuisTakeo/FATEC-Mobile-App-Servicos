import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, Platform } from 'react-native';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';
import { products, drinks } from '../constants/menu';
import { Hero } from './Hero';
import { SummaryCard } from './SummaryCard';
import { MenuSection } from './MenuSection';
import { TotalCard } from './TotalCard';
import { ConfirmButton } from './ConfirmButton';
import { BackgroundOrbs } from './BackgroundOrbs';

interface MainLayoutProps {
  productValue: string;
  setProductValue: (value: string) => void;
  drinkValue: string;
  setDrinkValue: (value: string) => void;
  selectedProduct: any;
  selectedDrink: any;
  total: number;
  onConfirmOrder: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  productValue,
  setProductValue,
  drinkValue,
  setDrinkValue,
  selectedProduct,
  selectedDrink,
  total,
  onConfirmOrder,
}) => {
  const { isDesktop, isMedium } = useResponsive();

  const contentPadding = isDesktop ? 40 : isMedium ? 30 : 20;
  const maxContentWidth = isDesktop ? 900 : '100%';

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollViewContent: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: contentPadding,
    },
    contentWrapper: {
      width: Platform.OS === 'web' ? '100%' : 'auto',
      maxWidth: maxContentWidth,
      paddingTop: isDesktop ? 80 : isMedium ? 70 : 60,
      paddingBottom: 48,
    },
  });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <BackgroundOrbs />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <Hero contentPadding={contentPadding} />

          <SummaryCard
            product={selectedProduct}
            drink={selectedDrink}
            total={total}
          />

          <MenuSection
            title="1. Escolha de produto"
            items={products}
            selectedValue={productValue}
            onSelectChange={setProductValue}
          />

          <MenuSection
            title="2. Escolha de bebida"
            items={drinks}
            selectedValue={drinkValue}
            onSelectChange={setDrinkValue}
          />

          <TotalCard
            product={selectedProduct}
            drink={selectedDrink}
            total={total}
          />

          <ConfirmButton onPress={onConfirmOrder} />
        </View>
      </ScrollView>
    </View>
  );
};
