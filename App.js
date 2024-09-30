import React from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native'
import TelaDeLogin from './Telas/TelaDeLogin';
import TelaInicio from './Telas/TelaInicio';
import TelaPrincipal from './Telas/TelaPrincipal';
import TelaDeCadastro from './Telas/TelaDeCadastro';
import TelaPerfil from './Telas/TelaPerfil';
import TelaDeOcorrencia from './Telas/TelaDeOcorrencia';
import TelaRelatorios from './Telas/TelaRelatorios';
import TelaUsuarios from './Telas/TelaUsuarios';
import TelaNotificacoes from './Telas/TelaNotificacoes';
import TelaImportarExportar from './Telas/TelaImportarExportar';
import TelaHistorico from './Telas/TelaHistorico';
import TelaChamados from './Telas/TelaChamados';
import TelaComentarios from './Telas/TelaComentarios';
import TelaAdmin from './Telas/TelaAdmin';
import TelaDeRecuperacaoSenha from './Telas/TelaDeRecuperacaoSenha';
import IncidentManagementScreen from './Telas/TelaDeOcorrencia';

const Stack = createNativeStackNavigator();

function Rotas() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TelaInicio" component={TelaInicio} options={{ headerShown: false }} />
      <Stack.Screen name="TelaDeLogin" component={TelaDeLogin} />
      <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
      <Stack.Screen name="TelaDeCadastro" component={TelaDeCadastro} />
      <Stack.Screen name="TelaPerfil" component={TelaPerfil} />
      <Stack.Screen name="TelaDeOcorrencia" component={TelaDeOcorrencia} />
      <Stack.Screen name ="TelaRelatorios" component={TelaRelatorios} />
      <Stack.Screen name ="TelaUsuarios" component={TelaUsuarios} />
      <Stack.Screen name ="TelaNotificacoes" component={TelaNotificacoes} />
      <Stack.Screen name ="TelaImportarExportar" component={TelaImportarExportar} />
      <Stack.Screen name ="TelaHistorico" component={TelaHistorico} />
      <Stack.Screen name ="TelaChamados" component={TelaChamados} />
      <Stack.Screen name ="TelaComentarios" component={TelaComentarios} />
      <Stack.Screen name ="TelaAdmin" component={TelaAdmin} />
      <Stack.Screen name ="TelaDeRecuperacaoSenha" component={TelaDeRecuperacaoSenha} />
      <Stack.Screen name ="IncidentManagementScreen" component={IncidentManagementScreen} />
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