import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Importando o calendário

function TelaDeAgendamento() {
  const [secretaries, setSecretaries] = useState([]);
  const [selectedSecretary, setSelectedSecretary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); 
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableDates, setAvailableDates] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [myAppointments, setMyAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null); // Estado para o horário selecionado

  useEffect(() => {
    fetchSecretaries();
  }, []);

  const fetchSecretaries = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.0.74:3000/secretaries');
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
    await fetchAvailableDates(secretary.id);
  };

  const fetchAvailableDates = async (secretaryId) => {
    try {
      const response = await fetch(`http://192.168.0.74:3000/available-dates?secretaryId=${secretaryId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar datas disponíveis');
      }
      const dates = await response.json();

      // Formatar as datas recebidas da API para o formato do Calendar
      const formattedDates = {};
      dates.forEach(date => {
        formattedDates[date] = { selected: false, marked: true, dotColor: 'green' };
      });
      setAvailableDates(formattedDates);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as datas disponíveis');
    }
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    fetchAvailableTimes(day.dateString);
  };

  const fetchAvailableTimes = async (date) => {
    if (!selectedSecretary) {
      Alert.alert('Erro', 'Nenhuma secretária selecionada.');
      return;
    }

    try {
      const url = `http://192.168.0.74:3000/available-times?date=${date}&secretaryId=${selectedSecretary.id}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar horários disponíveis: ${errorText}`);
      }

      const times = await response.json();
      setAvailableTimes(times);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis');
    }
  };

  const confirmAppointment = async () => {
    if (!selectedTime || !selectedDate) {
      Alert.alert('Erro', 'Por favor, selecione uma data e um horário.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.74:3000/schedule-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          secretaryId: selectedSecretary.id,
          date: selectedDate,
          startTime: selectedTime.start_time,
          endTime: selectedTime.end_time,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao agendar: ' + error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://192.168.0.74:3000/cancel-appointment/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
      fetchMyAppointments(); // Atualizar a lista de agendamentos após o cancelamento
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar o agendamento: ' + error.message);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const response = await fetch(`http://192.168.0.74:3000/my-appointments?userEmail=${userEmail}`);
      const appointments = await response.json();
      setMyAppointments(appointments);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar seus agendamentos');
    }
  };

  const openMyAppointments = async () => {
    await fetchMyAppointments();
    setModalVisible(true);
  };

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={[]} // Você pode usar um array vazio ou um estado para a lista de dados se necessário
      keyExtractor={(item) => item.id.toString()} // Ajuste conforme necessário
      renderItem={() => null} // Não renderiza itens, pois tudo está na estrutura abaixo
      ListHeaderComponent={
        <View>
          <Text style={styles.header}>Escolha uma Secretaria</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={secretaries}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.secretaryItem,
                    selectedSecretary?.id === item.id && styles.selectedSecretary,
                  ]}
                  onPress={() => handleSecretarySelect(item)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>Nenhuma secretaria disponível</Text>}
              nestedScrollEnabled={true} // Permite rolagem interna
            />
          )}

          {selectedSecretary && (
            <View>
              <Text style={styles.header}>Datas Disponíveis</Text>
              <Calendar
                markedDates={availableDates}
                onDayPress={handleDateSelect}
              />
            </View>
          )}

          {selectedDate && (
            <View>
              <Text style={styles.header}>Horários Disponíveis</Text>
              {availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <TouchableOpacity
                    key={`${time.start_time}-${time.end_time}`}
                    style={[
                      styles.timeSlot,
                      selectedTime?.start_time === time.start_time && styles.selectedTime,
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text>{`Das ${time.start_time} às ${time.end_time}`}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>Nenhum horário disponível</Text>
              )}
            </View>
          )}

          <TextInput
            style={styles.emailInput}
            placeholder="Digite seu e-mail"
            value={userEmail}
            onChangeText={setUserEmail}
          />

          <TouchableOpacity style={styles.button} onPress={confirmAppointment}>
            <Text style={styles.buttonText}>Confirmar Agendamento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={openMyAppointments}>
            <Text style={styles.buttonText}>Meus Agendamentos</Text>
          </TouchableOpacity>

          {/* Modal de Agendamentos */}
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Meus Agendamentos</Text>
                {myAppointments.length > 0 ? (
                  <FlatList
                    data={myAppointments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.appointmentItem}>
                        <Text>{`Data: ${new Date(item.date).toLocaleDateString()}`}</Text>
                        <Text>{`Horário: Das ${item.start_time} às ${item.end_time}`}</Text>
                        <TouchableOpacity
                          onPress={() => cancelAppointment(item.id)}
                          style={styles.cancelButton}
                        >
                          <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    nestedScrollEnabled={true} // Permite rolagem interna
                  />
                ) : (
                  <Text>Você não possui agendamentos</Text>
                )}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeModal}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  secretaryItem: { padding: 10, backgroundColor: '#f0f0f0', marginBottom: 5 },
  selectedSecretary: { backgroundColor: '#d0d0ff' },
  dateItem: { padding: 10, backgroundColor: '#e0e0e0', marginBottom: 5 },
  timeSlot: { padding: 10, backgroundColor: '#c0ffc0', marginBottom: 5 },
  selectedTime: { backgroundColor: '#00ff00' }, // Indica o horário selecionado
  emailInput: { padding: 10, borderColor: '#ddd', borderWidth: 1, marginTop: 10, marginBottom: 20 },
  button: { padding: 15, backgroundColor: '#007bff', borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { padding: 20, backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  appointmentItem: { padding: 10, borderBottomColor: '#ddd', borderBottomWidth: 1 },
  closeModal: { marginTop: 20, color: '#007bff', textAlign: 'center' },
  cancelButton: { padding: 5, backgroundColor: '#ff4d4d', marginTop: 10 },
  cancelButtonText: { color: '#fff', textAlign: 'center' },
});

export default TelaDeAgendamento;
