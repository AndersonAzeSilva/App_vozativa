import React from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

// Importação das telas
import TelaDeLogin from './Telas/TelaDeLogin';
import TelaInicio from './Telas/TelaInicio';
import TelaPrincipal from './Telas/TelaPrincipal';
import TelaDeCadastro from './Telas/TelaDeCadastro';
import TelaPerfil from './Telas/TelaPerfil';
import TelaPerfilAdmin from './Telas/TelaPerfilAdmin';
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
import TelaCadastrarSecretaria from './Telas/TelaCadastrarSecretaria';
import TelaConsultarSecretaria from './Telas/TelaConsultarSecretaria';
import TelaDadosPessoais from './Telas/TelaDadosPessoais';

//importando componentes


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TelaInicio" component={TelaInicio} options={{ headerShown: false }} />
      <Stack.Screen name="TelaDeLogin" component={TelaDeLogin} options={{ headerShown: false }} />
      <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} options={{ headerShown: false }} />
      <Stack.Screen name="TelaPerfil" component={TelaPerfil} />
      <Stack.Screen name="TelaPerfilAdmin" component={TelaPerfilAdmin} />
      <Stack.Screen name="TelaDeCadastro" component={TelaDeCadastro} />
      <Stack.Screen name="TelaDeOcorrencia" component={TelaDeOcorrencia} />
      <Stack.Screen name="TelaRelatorios" component={TelaRelatorios} />
      <Stack.Screen name="TelaUsuarios" component={TelaUsuarios} />
      <Stack.Screen name="TelaNotificacoes" component={TelaNotificacoes} />
      <Stack.Screen name="TelaImportarExportar" component={TelaImportarExportar} />
      <Stack.Screen name="TelaHistorico" component={TelaHistorico} />
      <Stack.Screen name="TelaChamados" component={TelaChamados} />
      <Stack.Screen name="TelaComentarios" component={TelaComentarios} />
      <Stack.Screen name="TelaDeRecuperacaoSenha" component={TelaDeRecuperacaoSenha} />
      <Stack.Screen name="TelaCadastrarSecretaria" component={TelaCadastrarSecretaria} />
      <Stack.Screen name="TelaConsultarSecretaria" component={TelaConsultarSecretaria} />
      <Stack.Screen name="TelaDadosPessoais" component={TelaDadosPessoais} />
      {/* Adicione a TelaAdmin ao StackNavigator */}
      <Stack.Screen name="TelaAdmin" component={AdminNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AdminNavigator() {
  return (
    <Drawer.Navigator initialRouteName="TelaAdmin">
      <Drawer.Screen name="Inicio" component={TelaAdmin} />
      <Drawer.Screen name="Perfil" component={TelaPerfil} />
      {/* Adicione mais telas ao Drawer se necessário */}
    </Drawer.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#38A69D" barStyle="light-content" />
      <Stack.Navigator>
        <Stack.Screen name="Stack" component={StackNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
