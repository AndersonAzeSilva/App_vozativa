import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TelaConsultarSecretaria = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultar Secretaria</Text>
      {/* Adicione a lógica de consulta aqui */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TelaConsultarSecretaria;
