 
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const UsuarioForm = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const criarUsuario = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await axios.post('http://192.168.0.74:3000/usuarios', { nome, email });
      Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      setNome('');
      setEmail('');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar usuário.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button title="Criar Usuário" onPress={criarUsuario} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default UsuarioForm;
