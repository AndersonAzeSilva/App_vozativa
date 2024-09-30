 
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, FlatList, Text } from 'react-native';
import axios from 'axios';

const Comentarios = () => {
  const [comentario, setComentario] = useState('');
  const [comentariosList, setComentariosList] = useState([]);

  const adicionarComentario = async () => {
    if (!comentario) {
      Alert.alert('Erro', 'Por favor, digite um comentário.');
      return;
    }

    try {
      await axios.post('http://192.168.0.48:3000/comentarios', { comentario });
      setComentariosList([...comentariosList, { comentario }]);
      setComentario('');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar comentário.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Seu comentário"
        value={comentario}
        onChangeText={setComentario}
        style={styles.input}
      />
      <Button title="Adicionar Comentário" onPress={adicionarComentario} />
      <FlatList
        data={comentariosList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.comentario}</Text>
          </View>
        )}
      />
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
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default Comentarios;
