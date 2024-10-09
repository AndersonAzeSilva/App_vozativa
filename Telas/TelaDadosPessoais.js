import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function TelaDadosPessoais() {
    const navigation = useNavigation();
    const [name, setName] = useState('José Anderson Azevedo Da Silva');
    const [email, setEmail] = useState('andersonazessilva@gmail.com');
    const [matricula, setMatricula] = useState('DG061195');
    const [profilePicture, setProfilePicture] = useState(require('../image/Andersonperfil.png'));

    // Função para selecionar a imagem do perfil
    const selectImage = () => {
        launchImageLibrary({}, (response) => {
            if (response.didCancel) {
                Alert.alert('Seleção cancelada', 'Você não selecionou nenhuma imagem.');
            } else if (response.errorCode) {
                Alert.alert('Erro', 'Erro ao selecionar a imagem. Tente novamente.');
            } else if (response.assets && response.assets.length > 0) {
                setProfilePicture({ uri: response.assets[0].uri });
            } else {
                Alert.alert('Erro', 'Nenhuma imagem selecionada.');
            }
        });
    };

    const saveData = () => {
        if (!name || !email || !matricula) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        // Lógica para salvar os dados, pode incluir uma requisição à API
        Alert.alert('Dados Salvos', 'As informações foram salvas com sucesso!');
        
        // Limpar os campos (opcional)
        setName('');
        setEmail('');
        setMatricula('');
        setProfilePicture(require('../image/Andersonperfil.png')); // Resetar imagem padrão
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={selectImage}>
                    <Image
                        source={profilePicture}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nome completo"
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="E-mail"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    value={matricula}
                    onChangeText={setMatricula}
                    placeholder="Matrícula"
                />
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TelaDadosPessoais')}>
                <Text style={styles.menuText}>Dados pessoais</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveData}>
                <Text style={styles.saveButtonText}>Salvar Dados</Text>
            </TouchableOpacity>
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
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        width: '80%',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    saveButton: {
        backgroundColor: '#e91e63',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
