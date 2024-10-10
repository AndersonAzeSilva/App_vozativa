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
      const response = await fetch('http://172.16.0.61:3000/incidents');
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
      const response = await fetch('http://172.16.0.61:3000/incidents', {
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
              await fetch(`http://172.16.0.61:3000/incidents/${id}`, {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente':
        return '#FFD700'; // Amarelo
      case 'em atendimento':
        return '#FFA500'; // Laranja
      case 'resolvida':
        return '#008000'; // Verde
      case 'encerrada':
        return '#FF0000'; // Vermelho
      default:
        return '#000000'; // Preto (padrão)
    }
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

  return (
    <View style={styles.container}>
      <FlatList
        data={incidents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Adicionar Ocorrência</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editIncident ? 'Editar Ocorrência' : 'Registrar Ocorrência'}</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Tipo"
            value={incidentType}
            onChangeText={setIncidentType}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateInput}>{incidentDate || 'Selecione a Data'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              is24Hour={true}
              onChange={handleDateChange}
            />
          )}
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateInput}>{incidentTime || 'Selecione a Hora'}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={true}
              onChange={handleTimeChange}
            />
          )}
          <Text style={styles.statusLabel}>Selecione o Status:</Text>
          <View style={styles.statusButtonsContainer}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusButton,
                  incidentStatus === option.value && { backgroundColor: getStatusColor(option.value) },
                ]}
                onPress={() => setIncidentStatus(option.value)}
              >
                <Text style={styles.statusButtonText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.imageContainer}>
            {incidentImages.map((image, index) => (
              <Image key={index} source={{ uri: image.uri }} style={styles.selectedImage} />
            ))}
            <TouchableOpacity onPress={selectImage} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Selecionar Imagem</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Tirar Foto</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleRegisterIncident}>
            <Text style={styles.submitButtonText}>Salvar</Text>
          </TouchableOpacity>
          <Button title="Fechar" onPress={resetForm} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  incidentItem: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  incidentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incidentType: {
    fontSize: 14,
  },
  incidentDate: {
    fontSize: 14,
  },
  incidentTime: {
    fontSize: 14,
  },
  incidentDescription: {
    fontSize: 14,
  },
  incidentProtocol: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  incidentStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  incidentImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  statusLabel: {
    marginTop: 10,
    fontSize: 16,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statusButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  statusButtonText: {
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
  imageButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  imageButtonText: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default IncidentManagementScreen;