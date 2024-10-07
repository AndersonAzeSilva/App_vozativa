import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

// Dados do gráfico
const data = {
  labels: ['Resolvidas', 'Atendimento', 'Encerradas', 'Pendentes', 'Abertas'],
  datasets: [{ data: [50, 30, 40, 10, 20] }],
};

const screenWidth = Dimensions.get('window').width;

const TelaAdmin = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const buttons = [
    { title: 'Gerenciar Ocorrências', icon: 'list', screen: 'TelaChamados', color: '#4CAF50' },
    { title: 'Ver Histórico', icon: 'time', screen: 'TelaHistorico', color: '#2196F3' },
    { title: 'Notificações', icon: 'notifications', screen: 'TelaNotificacoes', color: '#FF9800' },
    { title: 'Relatórios', icon: 'stats-chart', screen: 'TelaRelatorios', color: '#9C27B0' },
    { title: 'Cadastrar Secretaria', icon: 'person-add', screen: 'TelaCadastrarSecretaria', color: '#3F51B5' },
    { title: 'Consultar Secretaria', icon: 'search', screen: 'TelaConsultarSecretaria', color: '#E91E63' },
  ];

  const renderButton = ({ item }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Ionicons name={item.icon} size={24} color="#fff" />
      <Text style={styles.buttonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => (
    <>
      <Text style={styles.title}>Painel do Administrador</Text>

      <Text style={styles.chartTitle}>Estatísticas de Ocorrências</Text>
      <BarChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={buttons}
        renderItem={renderButton}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={renderContent}
        contentContainerStyle={styles.buttonContainer}
      />

      {/* Modal para exibir detalhes do usuário */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes do Usuário</Text>
            <Text>Informações adicionais podem ser exibidas aqui.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#e0e0e0',
  backgroundGradientTo: '#e0e0e0',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(3, 169, 244, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
  chartTitle: {
    fontSize: 20,
    marginBottom: 15,
    color: '#666',
    textAlign: 'center',
  },
  chart: {
    marginBottom: 20,
    borderRadius: 8,
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  // Estilos do modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TelaAdmin;
