 import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const HistoricoChamados = () => {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await axios.get('http://192.168.0.74:3000/historico');
        setHistorico(response.data);
      } catch (error) {
        console.error('Erro ao buscar histórico: ', error);
      }
    };

    fetchHistorico();
  }, []);

  return (
    <FlatList
      data={historico}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.titulo}</Text>
          <Text>{item.descricao}</Text>
          <Text>{item.data}</Text>
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

export default HistoricoChamados;
