import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { useResponsive } from '../../../styles/responsive';

export const BackgroundOrbs: React.FC = () => {
  const { width } = useResponsive();
  const isSmall = width < 480;

  const styles = StyleSheet.create({
    backgroundOrbTop: {
      position: 'absolute',
      width: isSmall ? 200 : 240,
      height: isSmall ? 200 : 240,
      borderRadius: isSmall ? 100 : 120,
      backgroundColor: colors.orb.orange,
      top: -70,
      right: -60,
    },
    backgroundOrbBottom: {
      position: 'absolute',
      width: isSmall ? 160 : 200,
      height: isSmall ? 160 : 200,
      borderRadius: isSmall ? 80 : 100,
      backgroundColor: colors.orb.blue,
      bottom: 20,
      left: -70,
    },
  });

  return (
    <>
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />
    </>
  );
};
