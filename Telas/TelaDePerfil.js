import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const UserProfileScreen = () => {
  const user = {
    name: 'José Anderson',
    email: 'andersonazesilva@gmail.com',
    profilePicture: '	https://lh3.googleusercontent.com/a/ACg8ocJlvAfAPD…BkpCbWNuQOhztxgN0Q4lLCwL5fZdxX4KEXudgE4=s288-c-no.Png', // Substitua pela URL real da imagem do perfil
    bio: 'Desenvolvedor de software apaixonado por tecnologia e inovação.',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={require('../image/Andersonperfil.png')} style={styles.profileImage} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      
      <View style={styles.bioSection}>
        <Text style={styles.bioTitle}>Sobre Mim</Text>
        <Text style={styles.bioText}>{user.bio}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  //Personalizando o container inferior
  container: {
    flex: 1,
    backgroundColor: '#fff', //Cort do container
  },
  //Personalizando o o container do Perfil
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#00bfff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  //personalizando a foto
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  //personalizando o nome do usuário
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  //personalizando o e-mail do usuário
  email: {
    fontSize: 16,
    color: '#000000',
    marginTop: 5,
  },
  bioSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  //personalizando o botão
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default UserProfileScreen;
