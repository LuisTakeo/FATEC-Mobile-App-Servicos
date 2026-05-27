import { useState } from 'react';
import { products, drinks } from '../constants/menu';

export const useMenu = () => {
  const [productValue, setProductValue] = useState(products[0].value);
  const [drinkValue, setDrinkValue] = useState(drinks[0].value);

  const selectedProduct = products.find((item) => item.value === productValue) ?? products[0];
  const selectedDrink = drinks.find((item) => item.value === drinkValue) ?? drinks[0];
  const total = selectedProduct.price + selectedDrink.price;

  return {
    productValue,
    setProductValue,
    drinkValue,
    setDrinkValue,
    selectedProduct,
    selectedDrink,
    total,
  };
};
