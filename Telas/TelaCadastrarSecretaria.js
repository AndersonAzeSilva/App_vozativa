import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const TelaCadastrarSecretaria = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Secretária</Text>
      <TextInput style={styles.input} placeholder="Nome" />
      <TextInput style={styles.input} placeholder="E-mail" />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TelaCadastrarSecretaria;
