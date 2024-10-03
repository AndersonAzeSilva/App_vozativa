import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const response = await axios.get('http://192.168.0.74:3000/notificacoes');
        setNotificacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar notificações: ', error);
      }
    };

    fetchNotificacoes();
  }, []);

  return (
    <FlatList
      data={notificacoes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.mensagem}</Text>
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

export default Notificacoes;
