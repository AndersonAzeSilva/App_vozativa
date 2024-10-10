import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

function TelaDeAgendamento() {
  const [secretaries, setSecretaries] = useState([]);
  const [selectedSecretary, setSelectedSecretary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]); // Armazena as datas disponíveis
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSecretaries();
  }, []);

  const fetchSecretaries = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://172.16.0.61:3000/secretaries');
      if (!response.ok) {
        throw new Error('Erro ao buscar secretárias');
      }
      const data = await response.json();
      setSecretaries(data);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar as secretárias');
    } finally {
      setLoading(false);
    }
  };

  const handleSecretarySelect = async (secretary) => {
    setSelectedSecretary(secretary);
    setShowCalendar(true);
    setAvailableTimes([]); // Limpar horários disponíveis ao selecionar nova secretária
    await fetchAvailableDates(secretary.id); // Buscar as datas disponíveis
  };

  const fetchAvailableDates = async (secretaryId) => {
    try {
      const response = await fetch(`http://172.16.0.61:3000/available-dates?secretaryId=${secretaryId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar datas disponíveis');
      }
      const dates = await response.json();
      setAvailableDates(dates);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as datas disponíveis');
      console.error(error);
    }
  };

  const handleDateChange = (event, date) => {
    const chosenDate = date || selectedDate;
    setSelectedDate(chosenDate);
    
    if (selectedSecretary) {
      fetchAvailableTimes(chosenDate);
    } else {
      Alert.alert('Erro', 'Selecione uma secretária antes de escolher a data.');
    }
  };

  const fetchAvailableTimes = async (date) => {
    if (!selectedSecretary) {
      Alert.alert('Erro', 'Nenhuma secretária selecionada.');
      return;
    }

    try {
      const formattedDate = date.toISOString().split('T')[0];
      const url = `http://172.16.0.61:3000/available-times?date=${formattedDate}&secretaryId=${selectedSecretary.id}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar horários disponíveis: ${errorText}`);
      }

      const times = await response.json();
      const formattedTimes = times.map(time => {
        const dateObj = new Date(`1970-01-01T${time}:00`);
        return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });
      setAvailableTimes(formattedTimes);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Escolha uma secretária</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={secretaries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.secretaryItem} onPress={() => handleSecretarySelect(item)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>Nenhuma secretária disponível</Text>}
        />
      )}

      {showCalendar && selectedSecretary && availableDates.length > 0 && (
        <View>
          <Text style={styles.header}>Escolha uma data disponível</Text>
          <FlatList
            data={availableDates}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleDateChange(null, new Date(item))}>
                <Text style={styles.dateItem}>{new Date(item).toLocaleDateString()}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.header}>Horários disponíveis</Text>
          {availableTimes.length > 0 ? (
            availableTimes.map((time) => (
              <TouchableOpacity key={time} style={styles.timeSlot} onPress={() => confirmAppointment(time)}>
                <Text>{time}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Nenhum horário disponível</Text>
          )}

          <TextInput
            style={styles.emailInput}
            placeholder="Digite seu e-mail"
            value={userEmail}
            onChangeText={setUserEmail}
          />
        </View>
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  secretaryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
  timeSlot: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 5,
  },
  emailInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingLeft: 10,
  },
});

export default TelaDeAgendamento;
