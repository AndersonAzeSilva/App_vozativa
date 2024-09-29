import React from 'react';
import { View, StyleSheet } from 'react-native';
import ImportarExportar from '../componentes/ImportarExportar';

const TelaImportarExportar = () => {
  return (
    <View style={styles.container}>
      <ImportarExportar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default TelaImportarExportar;
