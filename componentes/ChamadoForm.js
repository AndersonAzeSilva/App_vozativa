// componentes/ChamadoForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ChamadoForm = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const criarChamado = async () => {
    if (!titulo || !descricao) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await axios.post('http:// 192.168.0.74:3000/chamados', { titulo, descricao });
      Alert.alert('Sucesso', 'Chamado criado com sucesso!');
      setTitulo('');
      setDescricao('');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar chamado.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />
      <Button title="Criar Chamado" onPress={criarChamado} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default ChamadoForm;
