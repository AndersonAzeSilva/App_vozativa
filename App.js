import React from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native'
import TelaDeLogin from './Telas/TelaDeLogin';
import TelaInicio from './Telas/TelaInicio';
import TelaPrincipal from './Telas/TelaPrincipal';
import TelaDeCadastro from './Telas/TelaDeCadastro';
import TelaLoginServidor from './Telas/TelaLoginServidor';
import TelaDePerfil from './Telas/TelaDePerfil';
import ts from './Telas/ts';
import TelaDeOcorrencia from './Telas/TelaDeOcorrencia';

const Stack = createNativeStackNavigator();

function Rotas() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TelaInicio" component={TelaInicio} options={{ headerShown: false }} />
      <Stack.Screen name="TelaDeLogin" component={TelaDeLogin} />
      <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
      <Stack.Screen name="TelaDeCadastro" component={TelaDeCadastro} />
      <Stack.Screen name="TelaLoginServidor" component={TelaLoginServidor} />
      <Stack.Screen name="TelaDePerfil" component={TelaDePerfil} />
      <Stack.Screen name="ts" component={ts} />
      <Stack.Screen name="TelaDeOcorrencia" component={TelaDeOcorrencia} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#38A69D" barStyle="light-content" />
      <Rotas />
    </NavigationContainer>
  );
}