import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import OcorrenciasList from '../componentes/OcorrenciasList';
import StatusCard from '../componentes/StatusCard';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Importação de ícones

const TelaGerenciarOcorrencias = () => {
  const [dadosOcorrencias, setDadosOcorrencias] = useState({
    novas: 0,
    pendentes: 0,
    emAtendimento: 0,
    resolvidas: 0,
    encerradas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('nova'); // Inicie com 'nova'
  const [ocorrencias, setOcorrencias] = useState([]);

  useEffect(() => {
    fetchOcorrencias();
  }, []);

  const fetchOcorrencias = async () => {
    try {
      const response = await axios.get('http://192.168.0.74:3000/incidents');
      const ocorrencias = response.data;

      const statusValidos = ['nova', 'pendente', 'em atendimento', 'resolvida', 'encerrada'];
      const filtradasOcorrencias = ocorrencias.filter(o => statusValidos.includes(o.status));

      const novas = filtradasOcorrencias.filter(o => o.status === 'nova').length;
      const pendentes = filtradasOcorrencias.filter(o => o.status === 'pendente').length;
      const emAtendimento = filtradasOcorrencias.filter(o => o.status === 'em atendimento').length;
      const resolvidas = filtradasOcorrencias.filter(o => o.status === 'resolvida').length;
      const encerradas = filtradasOcorrencias.filter(o => o.status === 'encerrada').length;

      setDadosOcorrencias({ novas, pendentes, emAtendimento, resolvidas, encerradas });
      setOcorrencias(filtradasOcorrencias);
    } catch (err) {
      setError(`Erro ao carregar dados de ocorrências: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOcorrenciaAdd = async (novaOcorrencia) => {
    await axios.post('http://192.168.0.74:3000/incidents', novaOcorrencia);
    fetchOcorrencias();
  };

  const handleOcorrenciaEncerrar = async (id) => {
    await axios.patch(`http://192.168.0.74:3000/incidents/${id}`, { status: 'encerrada' });
    fetchOcorrencias();
  };

  const totalOcorrencias =
    dadosOcorrencias.novas +
    dadosOcorrencias.pendentes +
    dadosOcorrencias.emAtendimento +
    dadosOcorrencias.resolvidas +
    dadosOcorrencias.encerradas;

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  const PainelDashboard = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Painel de Controle</Text>
      <Text style={styles.total}>Total de Ocorrências: {totalOcorrencias}</Text>
      <View style={styles.statusContainer}>
        {Object.keys(dadosOcorrencias).map((status, idx) => (
          <TouchableOpacity key={idx} onPress={() => setSelectedStatus(status)}>
            <StatusCard title={status.charAt(0).toUpperCase() + status.slice(1)} count={dadosOcorrencias[status]} color={getColorForStatus(status)} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const OcorrenciasTab = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Ocorrências</Text>
      <OcorrenciasList
        status={selectedStatus} // Mostra automaticamente as ocorrências do status selecionado
        ocorrencias={ocorrencias.filter(o => o.status === selectedStatus)} // Filtra as ocorrências com base no status
        onOcorrenciaAdd={handleOcorrenciaAdd}
        onOcorrenciaEncerrar={handleOcorrenciaEncerrar}
      />
    </View>
  );

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Painel') {
            iconName = 'speedometer-outline'; // Ícone corrigido
          } else if (route.name === 'Ocorrências') {
            iconName = 'list-outline'; // Ícone corrigido
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Painel" component={PainelDashboard} options={{ title: 'Painel de Controle' }} />
      <Tab.Screen name="Ocorrências" component={OcorrenciasTab} options={{ title: 'Ocorrências' }} />
    </Tab.Navigator>
  );
};

const getColorForStatus = (status) => {
  switch (status) {
    case 'novas':
      return '#28a745';
    case 'pendentes':
      return '#ffc107';
    case 'emAtendimento':
      return '#6c757d';
    case 'resolvidas':
      return '#17a2b8';
    case 'encerradas':
      return '#dc3545';
    default:
      return '#007BFF';
  }
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
    color: '#007BFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  total: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TelaGerenciarOcorrencias;
