import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Calendar } from 'react-native-calendars'; // Certifique-se de instalar esta biblioteca

const TelaCadastrarSecretaria = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([{ startTime: '', endTime: '' }]);
  const [availableDates, setAvailableDates] = useState({}); // Para armazenar as datas disponíveis
  const [selectedDate, setSelectedDate] = useState(''); // Para armazenar a data selecionada

  useEffect(() => {
    // Simulando a recuperação das datas disponíveis (substitua por uma chamada à sua API)
    fetchAvailableDates();
  }, []);

  const fetchAvailableDates = async () => {
    // Aqui você deve buscar as datas disponíveis da sua API
    const dates = {
      '2024-10-10': { selected: false, marked: true, dotColor: 'green' },
      '2024-10-12': { selected: false, marked: true, dotColor: 'green' },
      '2024-10-15': { selected: false, marked: true, dotColor: 'green' },
    };
    setAvailableDates(dates);
  };

  const handleRegister = async () => {
    // Validação dos campos
    if (!name || !email || !address || !phone || !profileImage || !selectedDate) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Verifica se todos os horários estão preenchidos
    for (const time of availableTimes) {
      if (!time.startTime || !time.endTime) {
        Alert.alert('Erro', 'Por favor, preencha todos os horários disponíveis.');
        return;
      }
    }

    try {
      // Cadastrar a secretária e os horários
      const secretaryResponse = await fetch('http://172.16.0.61:3000/secretaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          address,
          phone,
          profileImage,
          availableTimes, // Passando horários disponíveis
          selectedDate, // Passando a data selecionada
        }),
      });

      // Verificando a resposta da API
      if (secretaryResponse.ok) {
        Alert.alert('Sucesso', 'Secretária cadastrada com sucesso!');
        // Limpa os campos após o cadastro
        setName('');
        setEmail('');
        setAddress('');
        setPhone('');
        setAvailableTimes([{ startTime: '', endTime: '' }]); // Resetando horários
        setProfileImage(null);
        setSelectedDate(''); // Resetando data
      } else {
        const errorData = await secretaryResponse.json(); // Obter detalhes do erro
        Alert.alert('Erro', `Erro ao cadastrar a secretária: ${errorData.message || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar ao servidor. Tente novamente.');
      console.error(error);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Erro', 'É necessário permitir o acesso à galeria de fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const addAvailableTime = () => {
    setAvailableTimes([...availableTimes, { startTime: '', endTime: '' }]);
  };

  const handleAvailableTimeChange = (index, field, value) => {
    const newTimes = [...availableTimes];
    newTimes[index][field] = value;
    setAvailableTimes(newTimes);
  };

  const onDayPress = (day) => {
    if (availableDates[day.dateString]) {
      setSelectedDate(day.dateString);
      const updatedDates = { ...availableDates };
      updatedDates[day.dateString].selected = !updatedDates[day.dateString].selected;
      setAvailableDates(updatedDates);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Secretária</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Selecionar Foto de Perfil</Text>
        )}
      </TouchableOpacity>

      {/* Calendário para selecionar datas disponíveis */}
      <Calendar
        markedDates={availableDates}
        onDayPress={onDayPress}
      />

      {availableTimes.map((time, index) => (
        <View key={index} style={styles.timeContainer}>
          <TextInput
            style={styles.input}
            placeholder="Hora de Início (HH:MM)"
            value={time.startTime}
            onChangeText={(value) => handleAvailableTimeChange(index, 'startTime', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Hora de Término (HH:MM)"
            value={time.endTime}
            onChangeText={(value) => handleAvailableTimeChange(index, 'endTime', value)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.addTimeButton} onPress={addAvailableTime}>
        <Text style={styles.buttonText}>Adicionar Horário</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePickerText: {
    color: '#007BFF',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addTimeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default TelaCadastrarSecretaria;
