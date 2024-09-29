import React from 'react';
import { View, StyleSheet } from 'react-native';
import ChamadoForm from '../componentes/ChamadoForm';
import ChamadosList from '../componentes/ChamadosList';

const TelaChamados = () => {
  return (
    <View style={styles.container}>
      <ChamadoForm />
      <ChamadosList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default TelaChamados;
