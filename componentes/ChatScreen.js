// Componentes/ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChatScreen = ({ route }) => {
  // Verifica se route.params está definido, caso contrário, usa valores padrão
  const usuario = route?.params?.usuario || { nome: 'Usuário Desconhecido', email: 'desconhecido@example.com' };
  const admin = route?.params?.admin || false; // Define admin como false se não for passado
  const [mensagens, setMensagens] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [protocolo, setProtocolo] = useState('');
  const [chatAtivo, setChatAtivo] = useState(false);
  const [perfilExpansivo, setPerfilExpansivo] = useState(false);

  useEffect(() => {
    // Gerar número de protocolo ao iniciar o bate-papo
    if (!protocolo) {
      const numProtocolo = `PROTO-${Math.floor(100000 + Math.random() * 900000)}`;
      setProtocolo(numProtocolo);
    }
  }, []);

  const enviarMensagem = () => {
    if (mensagem.trim()) {
      setMensagens((prevMensagens) => [...prevMensagens, { texto: mensagem, remetente: usuario.nome }]);
      setMensagem('');
    }
  };

  const iniciarChat = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChatAtivo(true);
  };

  const encerrarChat = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChatAtivo(false);
    setMensagens([]);
  };

  const alternarPerfil = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPerfilExpansivo(!perfilExpansivo);
  };

  const renderMensagem = ({ item }) => (
    <View style={[styles.mensagem, item.remetente === usuario.nome ? styles.mensagemUsuario : styles.mensagemAdmin]}>
      <Text style={styles.mensagemTexto}>{item.texto}</Text>
      <Text style={styles.mensagemRemetente}>{item.remetente}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.protocoloText}>Protocolo: {protocolo}</Text>

      <TouchableOpacity onPress={alternarPerfil} style={styles.perfilButton}>
        <Ionicons name={perfilExpansivo ? "chevron-up-outline" : "chevron-down-outline"} size={24} color="black" />
        <Text style={styles.perfilButtonText}>Perfil do Usuário</Text>
      </TouchableOpacity>

      {perfilExpansivo && (
        <View style={styles.perfilContainer}>
          <Text style={styles.perfilInfo}>Nome: {usuario.nome}</Text>
          <Text style={styles.perfilInfo}>Email: {usuario.email}</Text>
          <Text style={styles.perfilInfo}>Admin: {admin ? "Sim" : "Não"}</Text>
        </View>
      )}

      {!chatAtivo ? (
        <TouchableOpacity style={styles.iniciarButton} onPress={iniciarChat}>
          <Text style={styles.iniciarButtonText}>Iniciar Chat</Text>
        </TouchableOpacity>
      ) : (
        <>
          <FlatList
            data={mensagens}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMensagem}
            style={styles.mensagensContainer}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={mensagem}
              onChangeText={setMensagem}
              placeholder="Digite sua mensagem..."
            />
            <TouchableOpacity onPress={enviarMensagem} style={styles.enviarButton}>
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.encerrarButton} onPress={encerrarChat}>
            <Text style={styles.encerrarButtonText}>Encerrar Chat</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  protocoloText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007BFF',
  },
  perfilButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  perfilButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#007BFF',
  },
  perfilContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  perfilInfo: {
    fontSize: 16,
    color: '#333',
  },
  iniciarButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  iniciarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mensagensContainer: {
    flex: 1,
    marginBottom: 10,
  },
  mensagem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '75%',
  },
  mensagemUsuario: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
  },
  mensagemAdmin: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8d7da',
  },
  mensagemTexto: {
    fontSize: 16,
  },
  mensagemRemetente: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    elevation: 2,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  enviarButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
  },
  encerrarButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  encerrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
