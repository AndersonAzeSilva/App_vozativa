// Telas/ListaUsuarios.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Image, Alert, LayoutAnimation, UIManager, Platform } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const response = await axios.get('http://192.168.0.74:3000/usuarios'); // Atualizado para o endpoint correto
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };

    carregarUsuarios();
  }, []);

  const abrirModal = (usuario) => {
    setUsuarioSelecionado(usuario);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setUsuarioSelecionado(null);
    setModalVisible(false);
  };

  const excluirUsuario = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Chamada à API para excluir o usuário
              await axios.delete(`http://192.168.0.74:3000/usuarios/${id}`); // Atualizado para o endpoint correto
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              // Atualiza a lista de usuários após a exclusão
              setUsuarios(prevUsuarios => prevUsuarios.filter((usuario) => usuario.id !== id));
            } catch (error) {
              console.error('Erro ao excluir usuário:', error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => abrirModal(item)}>
      <Image source={{ uri: item.foto }} style={styles.foto} />
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => excluirUsuario(item.id)}>
        <Ionicons name="trash-bin-outline" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()} // Certificando que o id é uma string
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Modal para exibir detalhes do usuário */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes do Usuário</Text>
            {usuarioSelecionado && (
              <>
                <Image source={{ uri: usuarioSelecionado.foto }} style={styles.modalFoto} />
                <Text style={styles.modalText}>Nome: {usuarioSelecionado.nome}</Text>
                <Text style={styles.modalText}>Email: {usuarioSelecionado.email}</Text>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={fecharModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    marginLeft: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalFoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ListaUsuarios;
