import React from 'react';
import { View, StyleSheet } from 'react-native';
import UsuarioForm from '../componentes/UsuarioForm';
import UsuariosList from '../componentes/UsuariosList';

const TelaUsuarios = () => {
  return (
    <View style={styles.container}>
      <UsuarioForm />
      <UsuariosList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default TelaUsuarios;
