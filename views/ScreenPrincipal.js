import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IncidentManagementScreen from './ScreenOcorrencia'; // Corrigindo a importação da tela de gerenciamento de ocorrências
import TelaDeAgendamento from './ScreenAgendamento';

// Componente Feed
function Feed() {
  return (
    <View style={styles.centeredView}>
      <Text>Feed!</Text>
    </View>
  );
}

// Componente More
function More({ navigation }) {
  // Função para navegar para a tela de perfil
  const navigateToProfile = () => {
    navigation.navigate('TelaPerfil'); // Substitua pelo nome exato da sua tela de perfil
  };

  return (
    <ScrollView style={styles.moreContainer}>
      <Text style={styles.moreHeader}>Mais</Text>

      {/* Botão de Perfil */}
      <TouchableOpacity style={styles.moreItem} onPress={navigateToProfile}>
        <Text style={styles.moreText}>Perfil</Text>
      </TouchableOpacity>

      {/* Outras seções */}
      <TouchableOpacity style={styles.moreItem}>
        <Text style={styles.moreText}>Notificações</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreItem}>
        <Text style={styles.moreText}>Privacidade e termos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreItem}>
        <Text style={styles.moreText}>Apps VozAtiva</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreItem}>
        <Text style={styles.moreText}>Fale com VozAtiva</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Componente Notifications
function Notifications() {
  return (
    <View style={styles.centeredView}>
      <Text>Notifications!</Text>
    </View>
  );
}

// Criando o Tab Navigator
const Tab = createBottomTabNavigator();

export default function TelaPrincipal() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed} // Certifique-se de que a função Feed está corretamente referenciada
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Agendamento"
        component={TelaDeAgendamento} // Componente da tela de agendamento
        options={{
          tabBarLabel: 'Agendar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ocorrências"
        component={IncidentManagementScreen} // Usando o nome correto do componente
        options={{
          tabBarLabel: 'Ocorrências',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-text" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Mais"
        component={More}
        options={{
          tabBarLabel: 'Mais',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-horizontal" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Estilos
const styles = StyleSheet.create({
  moreContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  moreHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  moreItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  moreText: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
