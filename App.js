/////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Importação das Bibliotecas
/////////////////////////////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native'
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Importação das Telas
/////////////////////////////////////////////////////////////////////////////////////////////////////////
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
import TelaChamados from './Telas/TelaGerenciarOcorrencias';
import TelaComentarios from './Telas/TelaComentarios';
import TelaAdmin from './Telas/TelaAdmin';
import TelaDeRecuperacaoSenha from './Telas/TelaDeRecuperacaoSenha';
import IncidentManagementScreen from './Telas/TelaDeOcorrencia';

const Stack = createNativeStackNavigator();

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Criando as rotas de navegação entre as telas
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function Rotas() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TelaInicio" component={TelaInicio} options={{ headerShown: false }} />
      <Stack.Screen name="TelaDeLogin" component={TelaDeLogin} options={{ title: '' }} />
      <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} options={{ title: '' , headerShown: false }} />
      <Stack.Screen name="TelaDeCadastro" component={TelaDeCadastro} options={{ title: '' }} />
      <Stack.Screen name="TelaPerfil" component={TelaPerfil} options={{ title: '' }} />
      <Stack.Screen name="TelaDeOcorrencia" component={TelaDeOcorrencia} options={{ title: '' }} />
      <Stack.Screen name="TelaRelatorios" component={TelaRelatorios} options={{ title: '' }} />
      <Stack.Screen name="TelaUsuarios" component={TelaUsuarios} options={{ title: '' }} />
      <Stack.Screen name="TelaNotificacoes" component={TelaNotificacoes} options={{ title: '' }} />
      <Stack.Screen name="TelaImportarExportar" component={TelaImportarExportar} options={{ title: '' }} />
      <Stack.Screen name="TelaHistorico" component={TelaHistorico} options={{ title: '' }} />
      <Stack.Screen name="TelaChamados" component={TelaChamados} options={{ title: '' }} />
      <Stack.Screen name="TelaComentarios" component={TelaComentarios} options={{ title: '' }} />
      <Stack.Screen name="TelaAdmin" component={TelaAdmin} options={{ title: '' }} />
      <Stack.Screen name="TelaDeRecuperacaoSenha" component={TelaDeRecuperacaoSenha} options={{ title: '' }} />
      <Stack.Screen name="IncidentManagementScreen" component={IncidentManagementScreen} options={{ title: '' }} />
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
