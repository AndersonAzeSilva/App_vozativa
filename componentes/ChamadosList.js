import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const ChamadosList = () => {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const response = await axios.get('http://192.168.0.48:3000/chamados');
        setChamados(response.data);
      } catch (error) {
        console.error('Erro ao buscar chamados: ', error);
      }
    };

    fetchChamados();
  }, []);

  return (
    <FlatList
      data={chamados}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.titulo}</Text>
          <Text>{item.descricao}</Text>
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

export default ChamadosList;
