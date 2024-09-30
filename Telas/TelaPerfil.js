import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function TelaPerfil() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../image/Andersonperfil.png')} //adicionando a Foto
          style={styles.profileImage}
        />
        <Text style={styles.name}>José Anderson Azevedo Da Silva</Text>
        <Text style={styles.email}>andersonazessilva@gmail.com</Text>
        <Text style={styles.code}>Código CIEE: <Text style={styles.codeHighlight}>DG78342</Text></Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Dados pessoais</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Meus documentos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Vídeo de apresentação</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Carteira de Trabalho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Endereço</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Contatos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Responsável</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Nacionalidade</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  code: {
    fontSize: 16,
    marginTop: 5,
  },
  codeHighlight: {
    fontWeight: 'bold',
    color: '#e91e63', // Cor para destacar o código
  },
  menu: {
    marginTop: 20,
    padding: 10,
  },
  menuItem: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 16,
  },
});
