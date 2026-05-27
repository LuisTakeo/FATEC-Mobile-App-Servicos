import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, Platform, Text } from 'react-native';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';
import { products, drinks } from '../constants/menu';
import { Hero } from './Hero';
import { SummaryCard } from './SummaryCard';
import { MenuSelectButtons } from './MenuSelectButtons';
import { TotalCard } from './TotalCard';
import { ConfirmButton } from './ConfirmButton';
import { BackgroundOrbs } from './BackgroundOrbs';

interface CompactLayoutProps {
  productValue: string;
  setProductValue: (value: string) => void;
  drinkValue: string;
  setDrinkValue: (value: string) => void;
  selectedProduct: any;
  selectedDrink: any;
  total: number;
  onConfirmOrder: () => void;
  history?: {
    id: number;
    product: string;
    drink: string;
    total: number;
    createdAt: string;
  }[];
}

export const CompactLayout: React.FC<CompactLayoutProps> = ({
  productValue,
  setProductValue,
  drinkValue,
  setDrinkValue,
  selectedProduct,
  selectedDrink,
  total,
  onConfirmOrder,
  history,
}) => {
  const { isDesktop, isMedium, isSmall } = useResponsive();

  const contentPadding = isDesktop ? 40 : isMedium ? 30 : 20;

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
      maxWidth: isDesktop ? 600 : '100%',
      paddingTop: isDesktop ? 60 : isMedium ? 50 : 40,
      paddingBottom: 48,
    },
    menuSection: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: isDesktop ? 20 : isMedium ? 16 : isSmall ? 12 : 14,
      padding: isDesktop ? 24 : isMedium ? 20 : isSmall ? 14 : 16,
      marginBottom: isDesktop ? 28 : isMedium ? 24 : isSmall ? 16 : 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    historyCard: {
      backgroundColor: colors.surface,
      borderRadius: isDesktop ? 20 : isMedium ? 18 : isSmall ? 14 : 16,
      padding: isDesktop ? 20 : isMedium ? 18 : isSmall ? 14 : 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: isDesktop ? 28 : isMedium ? 24 : isSmall ? 16 : 20,
    },
    historyTitle: {
      color: colors.text.primary,
      fontSize: isDesktop ? 16 : isMedium ? 15 : isSmall ? 12 : 13,
      fontWeight: '700',
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    historyRow: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    historyText: {
      color: colors.text.primary,
      fontSize: isDesktop ? 14 : isMedium ? 13 : isSmall ? 11 : 12,
      fontWeight: '600',
    },
    historyMeta: {
      color: colors.text.secondary,
      fontSize: isDesktop ? 12 : isMedium ? 11 : isSmall ? 9 : 10,
      marginTop: 4,
    },
    historyEmpty: {
      color: colors.text.secondary,
      fontSize: isDesktop ? 13 : isMedium ? 12 : isSmall ? 10 : 11,
    },
    sectionTitle: {
      color: colors.accent.secondary,
      fontSize: isDesktop ? 13 : isMedium ? 12 : isSmall ? 10 : 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: isDesktop ? 16 : isMedium ? 14 : isSmall ? 10 : 12,
    },
  });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <BackgroundOrbs />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
      >
        <View style={styles.contentWrapper}>
          <Hero contentPadding={contentPadding} />

          <SummaryCard
            product={selectedProduct}
            drink={selectedDrink}
            total={total}
          />

          <View style={styles.menuSection}>
            <MenuSelectButtons
              label="Escolha seu prato"
              items={products}
              selectedValue={productValue}
              onSelectChange={setProductValue}
            />

            <MenuSelectButtons
              label="Escolha sua bebida"
              items={drinks}
              selectedValue={drinkValue}
              onSelectChange={setDrinkValue}
            />
          </View>

          <TotalCard
            product={selectedProduct}
            drink={selectedDrink}
            total={total}
          />

          {history ? (
            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>Historico de pedidos</Text>
              {history.length === 0 ? (
                <Text style={styles.historyEmpty}>Nenhum pedido salvo ainda.</Text>
              ) : (
                history.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.historyRow,
                      index === history.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <Text style={styles.historyText}>
                      {item.product} + {item.drink}
                    </Text>
                    <Text style={styles.historyMeta}>
                      Total: R$ {item.total.toFixed(2)} -{' '}
                      {new Date(item.createdAt).toLocaleString('pt-BR')}
                    </Text>
                  </View>
                ))
              )}
            </View>
          ) : null}

          <ConfirmButton onPress={onConfirmOrder} />
        </View>
      </ScrollView>
    </View>
  );
};
