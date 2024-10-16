import React from 'react';
import { View, StyleSheet } from 'react-native';
import Notificacoes from '../componentes/Notificacoes';

const TelaNotificacoes = () => {
  return (
    <View style={styles.container}>
      <Notificacoes />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default TelaNotificacoes;
