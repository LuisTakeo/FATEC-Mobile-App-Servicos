import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { CompactLayout } from './components/CompactLayout';
import { ConfirmationModal } from './components/ConfirmationModal';
import { FloatingBackButton } from '../../components/FloatingBackButton';
import { useMenu } from './hooks/useMenu';
import { insertPedidosHistory, listPedidosHistory } from '../../storage/db';

interface PedidosScreenProps {
  onBack: () => void;
  userId?: number;
}

export function PedidosScreen({ onBack, userId }: PedidosScreenProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [history, setHistory] = useState<
    { id: number; product: string; drink: string; total: number; createdAt: string }[]
  >([]);
  const {
    productValue,
    setProductValue,
    drinkValue,
    setDrinkValue,
    selectedProduct,
    selectedDrink,
    total,
  } = useMenu();

  useEffect(() => {
    if (!userId) return;
    listPedidosHistory(userId, 8).then(setHistory).catch(() => setHistory([]));
  }, [userId]);

  const handleConfirmOrder = async () => {
    if (!userId) {
      // still show confirmation for guest flows
      setShowConfirmation(true);
      return;
    }

    try {
      await insertPedidosHistory({
        userId,
        product: selectedProduct.label,
        drink: selectedDrink.label,
        total,
        createdAt: new Date().toISOString(),
      });
      const updated = await listPedidosHistory(userId, 8);
      setHistory(updated);
      setShowConfirmation(true);
    } catch (err) {
      console.warn('Failed to save order', err);
      Alert.alert('Erro', 'Nao foi possivel salvar o pedido.');
      setShowConfirmation(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CompactLayout
        productValue={productValue}
        setProductValue={setProductValue}
        drinkValue={drinkValue}
        setDrinkValue={setDrinkValue}
        selectedProduct={selectedProduct}
        selectedDrink={selectedDrink}
        total={total}
        onConfirmOrder={handleConfirmOrder}
        history={userId ? history : undefined}
      />
      <FloatingBackButton onPress={onBack} />
      <ConfirmationModal
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        productLabel={selectedProduct.label}
        drinkLabel={selectedDrink.label}
        total={total}
      />
    </View>
  );
}
