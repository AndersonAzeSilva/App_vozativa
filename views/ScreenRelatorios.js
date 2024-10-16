import React from 'react';
import { View, StyleSheet } from 'react-native';
import Relatorios from '../componentes/Relatorios';

const TelaRelatorios = () => {
  return (
    <View style={styles.container}>
      <Relatorios />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default TelaRelatorios;
