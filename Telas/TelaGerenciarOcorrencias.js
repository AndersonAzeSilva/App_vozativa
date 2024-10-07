import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import OcorrenciasList from '../componentes/OcorrenciasList'; // Verifique se o caminho está correto
import StatusCard from '../componentes/StatusCard'; // Verifique se o caminho está correto
import axios from 'axios';

const TelaGerenciarOcorrencias = () => {
  const [dadosOcorrencias, setDadosOcorrencias] = useState({
    novas: 0,
    pendentes: 0,
    resolvidas: 0,
    encerradas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [ocorrencias, setOcorrencias] = useState([]); // Novo estado para armazenar as ocorrências

  useEffect(() => {
    fetchOcorrencias(); // Carrega ocorrências ao montar o componente
  }, []);

  const fetchOcorrencias = async () => {
    try {
      const response = await axios.get('http://192.168.0.74:3000/incidents'); // URL da sua API
      const ocorrencias = response.data;

      // Ignorar ocorrências sem status
      const statusValidos = ['nova', 'pendente', 'resolvida', 'encerrada'];
      const filtradasOcorrencias = ocorrencias.filter(o => statusValidos.includes(o.status));

      // Calcule as contagens
      const novas = filtradasOcorrencias.filter(o => o.status === 'nova').length;
      const pendentes = filtradasOcorrencias.filter(o => o.status === 'pendente').length;
      const resolvidas = filtradasOcorrencias.filter(o => o.status === 'resolvida').length;
      const encerradas = filtradasOcorrencias.filter(o => o.status === 'encerrada').length;

      setDadosOcorrencias({ novas, pendentes, resolvidas, encerradas });
      setOcorrencias(filtradasOcorrencias); // Armazena a lista de ocorrências no estado
    } catch (err) {
      setError(`Erro ao carregar dados de ocorrências: ${err.message}`); // Corrigido aqui
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (status) => {
    setSelectedStatus(status); // Define o status selecionado
  };

  const handleOcorrenciaAdd = async (novaOcorrencia) => {
    // Função para registrar uma nova ocorrência
    await axios.post('http://192.168.0.74:3000/incidents', novaOcorrencia); // Chama a API para adicionar
    fetchOcorrencias(); // Atualiza as ocorrências após adicionar
  };

  const handleOcorrenciaEncerrar = async (id) => {
    // Função para encerrar uma ocorrência
    await axios.patch(`http://192.168.0.74:3000/incidents/${id}`, { status: 'encerrada' }); // Chama a API para encerrar
    fetchOcorrencias(); // Atualiza as ocorrências após encerrar
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Ocorrências</Text>
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => handleCardPress('novas')}>
          <StatusCard title="Novas Ocorrências" count={dadosOcorrencias.novas} color="#28a745" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCardPress('pendentes')}>
          <StatusCard title="Pendentes" count={dadosOcorrencias.pendentes} color="#ffc107" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCardPress('resolvidas')}>
          <StatusCard title="Resolvidas" count={dadosOcorrencias.resolvidas} color="#17a2b8" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCardPress('encerradas')}>
          <StatusCard title="Encerradas" count={dadosOcorrencias.encerradas} color="#dc3545" />
        </TouchableOpacity>
      </View>
      {selectedStatus && (
        <OcorrenciasList
          status={selectedStatus}
          ocorrencias={ocorrencias} // Passa a lista completa de ocorrências
          onOcorrenciaAdd={handleOcorrenciaAdd} // Passa a função para adicionar ocorrências
          onOcorrenciaEncerrar={handleOcorrenciaEncerrar} // Passa a função para encerrar ocorrências
        />
      )}
    </View>
  );
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
