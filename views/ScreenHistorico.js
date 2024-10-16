import React from 'react';
import { View, StyleSheet } from 'react-native';
import HistoricoChamados from '../componentes/HistoricoChamados';

const TelaHistorico = () => {
  return (
    <View style={styles.container}>
      <HistoricoChamados />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default TelaHistorico;
