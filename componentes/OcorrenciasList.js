import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Modal, Button, Image, ScrollView } from 'react-native';
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
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
              <Text style={styles.dateTimeButtonText}>Data: {incidentDate || 'Selecionar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
              <Text style={styles.dateTimeButtonText}>Hora: {incidentTime || 'Selecionar'}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <Text style={styles.statusLabel}>Status:</Text>
          {statusOptions.map((option) => (
            <TouchableOpacity key={option.value} onPress={() => setIncidentStatus(option.value)}>
              <Text style={[styles.statusOption, { color: incidentStatus === option.value ? 'blue' : 'black' }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Imagens:</Text>
            <TouchableOpacity onPress={selectImage} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Selecionar Imagens</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Tirar Foto</Text>
            </TouchableOpacity>
            <ScrollView horizontal>
              {incidentImages.map((image, index) => (
                <Image key={index} source={{ uri: image.uri }} style={styles.incidentImage} />
              ))}
            </ScrollView>
          </View>

          <Button title={editIncident ? 'Atualizar Ocorrência' : 'Registrar Ocorrência'} onPress={handleRegisterIncident} />
          <Button title="Cancelar" onPress={resetForm} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  dateTimeButtonText: {
    color: '#000',
  },
  statusLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  statusOption: {
    fontSize: 16,
    marginVertical: 5,
  },
  imageContainer: {
    marginVertical: 10,
  },
  imageLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  imageButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  incidentItem: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  incidentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incidentDescription: {
    marginTop: 5,
  },
  incidentType: {
    fontStyle: 'italic',
  },
  incidentDate: {
    fontWeight: 'bold',
  },
  incidentTime: {
    fontWeight: 'bold',
  },
  incidentProtocol: {
    fontWeight: 'bold',
  },
  incidentStatus: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  incidentImage: {
    width: 100,
    height: 100,
    marginRight: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default IncidentManagementScreen;
