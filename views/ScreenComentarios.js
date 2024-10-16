import React from 'react';
import { View, StyleSheet } from 'react-native';
import Comentarios from '../componentes/Comentarios';

const TelaComentarios = () => {
  return (
    <View style={styles.container}>
      <Comentarios />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default TelaComentarios;
