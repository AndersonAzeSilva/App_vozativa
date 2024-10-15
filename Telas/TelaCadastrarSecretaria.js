import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Calendar } from 'react-native-calendars';

const TelaCadastrarSecretaria = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([{ startTime: '', endTime: '' }]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  const fetchAvailableDates = async () => {
    // Simulação de datas disponíveis; buscar da API
    const dates = {
      '2024-10-10': { marked: true, dotColor: 'green' },
      '2024-10-12': { marked: true, dotColor: 'green' },
      '2024-10-15': { marked: true, dotColor: 'green' },
    };
    setMarkedDates(dates);
  };

  const handleRegister = async () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!name || !email || !address || !phone || !profileImage || availableTimes.length === 0) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    // Valida os horários disponíveis
    for (const time of availableTimes) {
      if (!time.start_time || !time.end_time) { // Garantindo que usamos start_time e end_time
        Alert.alert('Erro', 'Por favor, preencha todos os horários disponíveis.');
        return;
      }
    }
  
    try {
      // Enviando dados para o servidor
      const secretaryResponse = await fetch('http://192.168.0.74:3000/secretaries', {
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
          availableTimes: availableTimes.map(time => ({
            start_time: time.start_time, // Garantindo o uso correto do nome da propriedade
            end_time: time.end_time       // Garantindo o uso correto do nome da propriedade
          })),
        }),
      });
  
      // Logando a resposta completa para análise
      console.log('Resposta da API:', secretaryResponse);
  
      // Garantindo que a resposta seja convertida para JSON se possível
      let responseData;
      try {
        responseData = await secretaryResponse.json();
        console.log('Dados da resposta:', responseData);
      } catch (jsonError) {
        console.error('Erro ao processar o JSON da resposta:', jsonError);
        Alert.alert('Erro', 'Resposta inesperada do servidor.');
        return;
      }
  
      if (secretaryResponse.ok) {
        Alert.alert('Sucesso', 'Secretária cadastrada com sucesso!');
  
        // Limpar os campos após o sucesso
        setName('');
        setEmail('');
        setAddress('');
        setPhone('');
        setAvailableTimes([{ start_time: '', end_time: '' }]); // Inicializa novamente com valores vazios
        setProfileImage(null);
        // Se não estiver usando setSelectedDate e setMarkedDates, você pode removê-los
      } else {
        // Exibir mensagem de erro da resposta, se existir
        const errorMessage = responseData.message || 'Erro desconhecido.';
        Alert.alert('Erro', `Erro ao cadastrar a secretária: ${errorMessage}`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar ao servidor. Tente novamente.');
      console.error('Erro na requisição:', error);
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
    const newMarkedDates = { ...markedDates };

    Object.keys(newMarkedDates).forEach((date) => {
      if (newMarkedDates[date].selected) {
        newMarkedDates[date].selected = false;
      }
    });

    newMarkedDates[day.dateString] = {
      selected: true,
      marked: true,
      selectedColor: 'blue',
    };

    setMarkedDates(newMarkedDates);
    setSelectedDate(day.dateString);
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

      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          selectedDayBackgroundColor: 'blue',
          selectedDayTextColor: '#fff',
          todayTextColor: 'red',
          dayTextColor: '#2d4150',
          monthTextColor: '#2d4150',
        }}
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
