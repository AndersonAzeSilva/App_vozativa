import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const StatusCard = ({ 
  title = 'Título', 
  count = 0, 
  color = '#007BFF' 
}) => {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15, // Espaçamento entre os cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // Para Android
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Cor do texto do título
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Cor do texto da contagem
  },
});

// Definindo propTypes para garantir que as propriedades recebidas estejam corretas
StatusCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  color: PropTypes.string,
};

export default StatusCard;
