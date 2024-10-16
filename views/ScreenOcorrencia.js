import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Modal, Button, Image, ScrollView, } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const IncidentManagementScreen = () => {
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [incidentStatus, setIncidentStatus] = useState('pendente');
  const [incidentImages, setIncidentImages] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [editIncident, setEditIncident] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const response = await fetch('http://192.168.0.74:3000/incidents');
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error('Error loading incidents', error);
    }
  };

  const validateInputs = () => {
    if (!incidentTitle) {
      Alert.alert('Erro', 'Título é obrigatório.');
      return false;
    }
    if (!incidentDescription) {
      Alert.alert('Erro', 'Descrição é obrigatória.');
      return false;
    }
    if (!incidentType) {
      Alert.alert('Erro', 'Tipo é obrigatório.');
      return false;
    }
    return true;
  };

  const registerIncident = async (incident) => {
    try {
      const response = await fetch('http://192.168.0.74:3000/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incident),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar a ocorrência');
      }

      await response.json();
    } catch (error) {
      console.error('Error registering incident', error);
      Alert.alert('Erro', 'Falha ao registrar a ocorrência');
    }
  };

  const handleRegisterIncident = async () => {
    if (!validateInputs()) return;

    const now = new Date();
    const formattedDate = incidentDate || now.toISOString().split('T')[0];
    const formattedTime = incidentTime || `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newIncident = {
      protocolNumber: `PROTOCOLO-${Date.now()}`,
      title: incidentTitle,
      description: incidentDescription,
      type: incidentType,
      date: formattedDate,
      time: formattedTime,
      status: incidentStatus,
      images: incidentImages,
    };

    await registerIncident(newIncident);
    Alert.alert('Sucesso', 'Ocorrência registrada com sucesso!');
    resetForm();
    loadIncidents();
  };

  const handleEditIncident = (incident) => {
    setEditIncident(incident);
    setIncidentTitle(incident.title);
    setIncidentDescription(incident.description);
    setIncidentType(incident.type);
    setIncidentDate(incident.date);
    setIncidentTime(incident.time);
    setIncidentStatus(incident.status);
    setIncidentImages(incident.images || []);
    setModalVisible(true);
  };

  const handleDeleteIncident = async (id) => {
    Alert.alert(
      'Excluir Ocorrência',
      'Tem certeza que deseja excluir esta ocorrência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await fetch(`http://192.168.0.74:3000/incidents/${id}`, {
                method: 'DELETE',
              });
              loadIncidents();
              Alert.alert('Sucesso', 'Ocorrência excluída com sucesso!');
            } catch (error) {
              console.error('Error deleting incident', error);
              Alert.alert('Erro', 'Falha ao excluir a ocorrência');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setIncidentDate(selectedDate ? selectedDate.toISOString().split('T')[0] : incidentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    setIncidentTime(selectedTime ? `${selectedTime.getHours()}:${String(selectedTime.getMinutes()).padStart(2, '0')}` : incidentTime);
  };

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.7,
      },
      (response) => {
        if (response.assets) {
          const selectedImages = response.assets.map(asset => ({
            uri: asset.uri,
            fileName: asset.fileName,
          }));
          setIncidentImages(prevImages => [...prevImages, ...selectedImages]);
        }
      }
    );
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.7,
      },
      (response) => {
        if (response.assets) {
          const newPhoto = response.assets.map(asset => ({
            uri: asset.uri,
            fileName: asset.fileName,
          }));
          setIncidentImages(prevImages => [...prevImages, ...newPhoto]);
        }
      }
    );
  };

  const resetForm = () => {
    setIncidentTitle('');
    setIncidentDescription('');
    setIncidentType('');
    setIncidentDate('');
    setIncidentTime('');
    setIncidentStatus('pendente');
    setIncidentImages([]);
    setEditIncident(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.incidentItem, { borderColor: getStatusColor(item.status) }]}>
      <Text style={styles.incidentTitle}>{item.title}</Text>
      <Text style={styles.incidentType}>Tipo: {item.type}</Text>
      <Text style={styles.incidentDate}>Data: {item.date}</Text>
      <Text style={styles.incidentTime}>Horário: {item.time}</Text>
      <Text style={styles.incidentDescription}>{item.description}</Text>
      <Text style={styles.incidentProtocol}>Protocolo: {item.protocolNumber}</Text>
      <Text style={[styles.incidentStatus, { color: getStatusColor(item.status) }]}>
        Status: {item.status}
      </Text>
      <ScrollView horizontal>
        {item.images?.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.incidentImage} />
        ))}
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditIncident(item)}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteIncident(item.id)}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const statusOptions = [
    { label: 'Pendente', value: 'pendente' },
    { label: 'Em Atendimento', value: 'em atendimento' },
    { label: 'Resolvida', value: 'resolvida' },
    { label: 'Encerrada', value: 'encerrada' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente':
        return '#808080'; //Cor cinza
      case 'em atendimento':
        return '#FFA500'; // cor laranja
      case 'resolvida': 
        return '#008000'; //Cor verde
      case 'encerrada':
        return '#ff0000'; //cor vermelho
      default:
        return '#000000'; //Cor preta
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={incidents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyListText}>Nenhuma ocorrência registrada.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Adicionar Ocorrência</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={resetForm}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editIncident ? 'Editar Ocorrência' : 'Nova Ocorrência'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={incidentTitle}
            onChangeText={setIncidentTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={incidentDescription}
            onChangeText={setIncidentDescription}
          />
          <TextInput style={styles.input} placeholder="Tipo" value={incidentType} onChangeText={setIncidentType} />
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerText}>{incidentDate ? `Data: ${incidentDate}` : 'Selecionar Data'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.timePickerText}>{incidentTime ? `Hora: ${incidentTime}` : 'Selecionar Hora'}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker value={new Date()} mode="date" display="default" onChange={handleDateChange} />
          )}

          {showTimePicker && (
            <DateTimePicker value={new Date()} mode="time" display="default" onChange={handleTimeChange} />
          )}

          <Text style={styles.label}>Imagens:</Text>
          <View style={styles.imageContainer}>
            <ScrollView horizontal>
              {incidentImages.map((image, index) => (
                <Image key={index} source={{ uri: image.uri }} style={styles.incidentImage} />
              ))}
            </ScrollView>
          </View>
          <View style={styles.imageButtonsContainer}>
            <Button title="Selecionar da Galeria" onPress={selectImage} />
            <Button title="Tirar Foto" onPress={takePhoto} />
          </View>

          <Text style={styles.label}>Status:</Text>
          <View style={styles.statusContainer}>
            {['pendente', 'em atendimento', 'resolvida', 'encerrada'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.statusButton, incidentStatus === status && styles.activeStatusButton]}
                onPress={() => setIncidentStatus(status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    incidentStatus === status && styles.activeStatusButtonText,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalBotaoContainer}>
            <TouchableOpacity style={styles.BotaoCancelar} onPress={resetForm}>
              <Text style={styles.BotaoCancelarText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BotaoSalvar} onPress={handleRegisterIncident}>
              <Text style={styles.BotaoSalvarText}>
                {editIncident ? 'Salvar Alterações' : 'Registrar Ocorrência'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  //estilizando o container de fundo da tela principal da tela de ocorrências
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#d3d3d3', //cor do fundo
  },
  //estilizando a caixa de registro das ocorrências
  incidentItem: {
    padding: 10, //ajustando o texto dentro da caixa
    marginVertical: 5, //margem vertical da caixa
    borderWidth: 3, //largura da borda
    borderRadius: 10, //borda da caixa
    backgroundColor: '#FFFFFF', //cor da caixa
  },
  //estilizando o titulo da caixa de ocorrências
  incidentTitle: {
    fontSize: 18, //tamanho da fonte
    fontWeight: 'bold', //negrito
  },
  //estilizando o texto do tipo de ocorrÊncia
  incidentType: {
    fontSize: 14, //tamanho da fonte do texto
    fontWeight: 'bold', //negrito
    color: '#000000', //cor do texto
  },
  //estilizando o texto da data na caixa de registro da ocorrência
  incidentDate: {
    fontSize: 14, //tamanho do texto
    color: '#0000cd', //cor do texto
  },
  //estilizando o texto do horário na caixa de registro da ocorrência
  incidentTime: {
    fontSize: 14, //tamanho do texto
    color: '#0000cd', //cor do texto
  },
  //estilizando o texto da descrição da ocorrência
  incidentDescription: {
    fontSize: 14, //tamanho do texto
    color: '#000000', //cor do texto
  },
  //estilizando o texto do protocolo
  incidentProtocol: {
    fontSize: 14, //tamanho da fonte do texto
    color: '#0000cd', //color do texto
    marginVertical: 5,
  },
  //estilizando o texto de status da ocorrÊncia no na caixa de registro
  incidentStatus: {
    fontSize: 18, //tamanho do texto
    fontWeight: 'bold', //negrito
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10, //margem dos botões de editar e excluir da caixa de registro de ocorrência
  },
  //estilizando o botão editar da caixa de registro da ocorrência
  editButton: {
    padding: 5, //tamanho do botão
    backgroundColor: '#007BFF', //cor do botão
    borderRadius: 5, //arredondando as bordas do botão
  },
  //estilizando o texto do botão editar da caixa de registro da ocorrência
  editButtonText: {
    color: '#FFFFFF', //cor do texto
    fontSize: 14, //tamanho do texto
  },
  //estilizando o botão excluir da caixa de registro da ocorrência
  deleteButton: {
    padding: 5, //tamanho do botão
    backgroundColor: '#FF0000', //cor do botão
    borderRadius: 5, //arredondando as bordas do botão
  },
  //estilizando o texto do botão excluir da caixa de registro da ocorrência
  deleteButtonText: {
    color: '#FFFFFF', //cor do texto
    fontSize: 14, //tamanho do texto
  },
  //estilizando o container da lista de ocorrências
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16, //tamanho da fonte do texto
    color: '#999999',//cor
  },
  addButton: {
    //estilizando o botão de adicionar ocorrência
    padding: 10, //altura do botão
    backgroundColor: '#3e606f', //cor do botão
    borderRadius: 15, //arrendodamento da borda do botão
    alignItems: 'center', //centralizando o texto dentro do botão
  },
  //estilizando o texto do botão de adicionar ocorrência
  addButtonText: {
    color: '#FFFFFF', //cor do texto
    fontSize: 16, //tamanho do
  },
  //estilizando o container modal a onde preenchemos os dados da ocorrência
  modalContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF', //cor de fundo
    flexGrow: 1,
  },
  //estilizando o titulo do modal do registro de ocorrência
  modalTitle: {
    fontSize: 25, //tamanho do texto
    fontWeight: 'bold', //fonte do texto
    marginBottom: 20, //margem do botão
    
  },
  //estilizando o os campos de texto do preenchimento da ocorrÊncia
  input: {
    borderWidth: 2, //largura daborda
    borderColor: '#3e606f', //cor da borda
    padding: 10, //altura entre os botões
    borderRadius: 5, //arredondamento das bordas do botão
    marginBottom: 15, //margem entre os botões
    fontSize: 16, //fonte do texto
    color: '#000000', //cor do texto
  },
  //estilizando o container da hora
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15, //espaçamento entre os botões
  },
  //estilizando o texto do botão da data
  datePickerText: {
    fontSize: 16, //tamanho do texto
    color: '#007BFF', //cor do texto
  },
  //estilizando o texto do selecionar hora
  timePickerText: {
    fontSize: 16, //tamanho do texto
    color: '#007BFF', //cor do texto
  },
  //estilizando a label do campo da foto
  label: {
    fontSize: 16, //tamanho da fonte do texto imagens e status
    fontWeight: 'bold', //negrito
    marginBottom: 10,
  },
  //estilizando o container do nome imagem
  imageContainer: {
    marginBottom: 15, //margem do botão
  },
  incidentImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  //estilizando o container do botão selecionar foto da galeria e tirar foto
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  //estilizando o container dos botões de status
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, //margem do botão
  },
  //estilizando o botão de status
  statusButton: {
    padding: 7,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 2,
    marginTop: 10, //tamanho da margem do top
  },
  //estilizando o tamanho da fonte dos botões de status
  statusButtonText: {
    padding: 3,
    paddingBottom: 3,
    paddingRight: 3,
    paddingTop: 10,
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 10, //tamanho da fonte
    fontWeight: 'bold',
  },
  //estilizando o botão status de pendente 
  activeStatusButton: {
    padding: 11,
    borderRadius: 5,
    flex: 1,
    backgroundColor: '#007BFF',
    marginTop: 10, //atura do botão
    justifyContent: 'center',
    alignItems: 'center', //Centralizando o texto dentro do botão
  },
  //estilizando o texto do status de pendente
  activeStatusButtonText: {
    color: '#FFFFFF', //cor do texto 
    fontSize: 12, //tamanho da fonte do texto
    flex: 1,
    alignItems: 'center', //alinhando o texto ao centro do botão
    fontWeight: 'bold',
  },
  modalBotaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BotaoCancelar: {
    padding: 10, //altura do botão
    backgroundColor: '#FF0000', //cor do botão cancelar
    borderRadius: 5, //arredondamento da borda do botão
    flex: 1,
    alignItems: 'center', //alinhando o texto ao centro do botão
    marginRight: 10, //margem dirieita do botão
  },
  //estilizando o texto do botão Cancelar
  BotaoCancelarText: {
    color: '#FFFFFF', //cor do botão
    fontSize: 16, //tamanho do texto
  },
  //estilizando o botão registrar ocorrência
  BotaoSalvar: {
    padding: 10, //tamanho do botão
    backgroundColor: '#3e606f', //cor do botão
    borderRadius: 5, //arredondando a borda do botão
    flex: 1,
    alignItems: 'center', //alinhando o texto ao centro do botão
  },
  //estilizando a cor do botão registrar
  BotaoSalvarText: {
    color: '#FFFFFF', //cor do texto
    fontSize: 16, //tamanho do texto
  },
});


export default IncidentManagementScreen;