 
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://192.168.0.74:3000/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários: ', error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <FlatList
      data={usuarios}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.nome}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontWeight: 'bold',
  },
});

export default UsuariosList;
