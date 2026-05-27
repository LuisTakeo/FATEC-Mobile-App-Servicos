import { MenuItem } from '../types/menu';

export const products: MenuItem[] = [
  {
    label: 'Hambúrguer',
    value: 'hamburguer',
    price: 25,
    image: require('../../../../assets/images/hamburguer.jpg'),
    accent: '#ff8c42',
  },
  {
    label: 'Pizza',
    value: 'pizza',
    price: 32,
    image: require('../../../../assets/images/pizza.avif'),
    accent: '#ff5d73',
  },
  {
    label: 'Hot Dog',
    value: 'hotdog',
    price: 18,
    image: require('../../../../assets/images/hotdog.webp'),
    accent: '#f7b801',
  },
];

export const drinks: MenuItem[] = [
  {
    label: 'Refrigerante',
    value: 'refrigerante',
    price: 8,
    image: require('../../../../assets/images/refri.jpg'),
    accent: '#3b82f6',
  },
  {
    label: 'Suco',
    value: 'suco',
    price: 10,
    image: require('../../../../assets/images/suco.jpg'),
    accent: '#10b981',
  },
  {
    label: 'Água',
    value: 'agua',
    price: 5,
    image: require('../../../../assets/images/agua.jpg'),
    accent: '#06b6d4',
  },
];
