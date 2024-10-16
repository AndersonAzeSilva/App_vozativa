import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Modal, Animated } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../componentes/ChatScreen'; // Tela de chat que será implementada
import ListaUsuarios from '../componentes/ListaUsuarios'; // Tela com a lista de usuários cadastrados

const screenWidth = Dimensions.get('window').width;

const Tab = createBottomTabNavigator();

const TelaAdmin = ({ navigation }) => {
  const [chartData, setChartData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1)); // Animação de escala

  const carregarDadosDoGrafico = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos
  
      const response = await fetch('http://192.168.0.74:3000/incidents/status', { signal: controller.signal });
  
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados do gráfico');
      }
  
      const data = await response.json();
      console.log('Dados do gráfico:', data);
  
      // Formatar os dados corretamente
      const chartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            color: (opacity = 1) => `rgba(3, 169, 244, ${opacity})`, // Cor
            strokeWidth: 2,
          },
        ],
      };
  
      setChartData(chartData);
    } catch (error) {
      console.error('Erro ao carregar os dados do gráfico:', error);
      if (error.name === 'AbortError') {
        console.error('A requisição foi abortada devido ao timeout.');
      }
    }
  };

  const buttons = [
    { title: 'Gerenciar Ocorrências', icon: 'list', screen: 'TelaChamados', color: '#4CAF50' },
    { title: 'Ver Histórico', icon: 'time', screen: 'TelaHistorico', color: '#2196F3' },
    { title: 'Notificações', icon: 'notifications', screen: 'TelaNotificacoes', color: '#FF9800' },
    { title: 'Relatórios', icon: 'stats-chart', screen: 'TelaRelatorios', color: '#9C27B0' },
    { title: 'Cadastrar Secretaria', icon: 'person-add', screen: 'TelaCadastrarSecretaria', color: '#3F51B5' },
    { title: 'Consultar Secretaria', icon: 'search', screen: 'TelaConsultarSecretaria', color: '#E91E63' },
  ];

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const renderButton = ({ item }) => (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: item.color }]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => navigation.navigate(item.screen)}
      >
        <Ionicons name={item.icon} size={24} color="#fff" />
        <Text style={styles.buttonText}>{item.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderContent = () => (
    <>
      <Text style={styles.title}>Painel do Administrador</Text>
      <Text style={styles.chartTitle}>Estatísticas de Ocorrências</Text>
      {chartData ? (
        <BarChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      ) : (
        <Text>Carregando dados...</Text>
      )}
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

// Configuração do gráfico
const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#f5f5f5',
  backgroundGradientTo: '#f5f5f5',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(3, 169, 244, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

// Navegação por abas inferior com chat e lista de usuários
const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Admin"
      component={TelaAdmin}
      options={{
        tabBarLabel: 'Admin',
        tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        headerShown: false, // Removendo Cabeçalho 
      }}
    />
    <Tab.Screen
      name="Chat"
      component={ChatScreen}
      options={{
        tabBarLabel: 'Chat',
        tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" color={color} size={size} />,
        headerShown: false, // Removendo Cabeçalho 
      }}
    />
    <Tab.Screen
      name="Usuários"
      component={ListaUsuarios}
      options={{
        tabBarLabel: 'Usuários',
        tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
        headerShown: false, // Removendo Cabeçalho 
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
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
    borderRadius: 12, // Borda mais arredondada
    marginVertical: 10,
    elevation: 3, // Sombra no Android
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
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

export default TabNavigator;
 