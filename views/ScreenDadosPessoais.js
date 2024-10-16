import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function TelaDadosPessoais() {
    const navigation = useNavigation();

    // Estados para cada campo do formulário
    const [nome, setNome] = useState("José Anderson Azevedo Da Silva");
    const [email, setEmail] = useState("andersonazessilva@gmail.com");
    const [telefone, setTelefone] = useState("(11) 99999-9999");
    const [cpf, setCpf] = useState("123.456.789-00");
    const [endereco, setEndereco] = useState("Rua das Flores, 123");
    const [senha, setSenha] = useState("senha123");
    const [confirmeSenha, setConfirmeSenha] = useState("senha123");
    const [matricula, setMatricula] = useState("DG061195");
    const [isAdmin, setIsAdmin] = useState(false);
    const [fotoPerfil, setFotoPerfil] = useState(null);

    const salvarDados = () => {
        // Lógica para validar os dados antes de salvar
        if (senha !== confirmeSenha) {
            Alert.alert("Erro", "As senhas não correspondem!");
            return;
        }

        // Aqui você pode adicionar a lógica para salvar os dados no banco de dados
        Alert.alert("Dados salvos", "Seus dados pessoais foram atualizados com sucesso!");
        navigation.goBack(); // Volta para a tela anterior após salvar
    };

    const escolherFoto = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('Usuário cancelou a seleção de imagem');
            } else if (response.error) {
                console.log('Erro ao escolher imagem: ', response.error);
            } else {
                setFotoPerfil(response.assets[0].uri); // Armazena a URI da imagem escolhida
            }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.perfilBar}>
                <TouchableOpacity onPress={escolherFoto}>
                    {fotoPerfil ? (
                        <Image source={{ uri: fotoPerfil }} style={styles.fotoPerfil} />
                    ) : (
                        <View style={styles.fotoPerfilPlaceholder}>
                            <Text style={styles.placeholderText}>Clique para adicionar foto</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={styles.nomePerfil}>{nome}</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Nome:</Text>
                <TextInput 
                    style={styles.input} 
                    value={nome} 
                    onChangeText={setNome} 
                />
                
                <Text style={styles.label}>E-mail:</Text>
                <TextInput 
                    style={styles.input} 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address"
                />
                
                <Text style={styles.label}>Telefone:</Text>
                <TextInput 
                    style={styles.input} 
                    value={telefone} 
                    onChangeText={setTelefone} 
                />
                
                <Text style={styles.label}>CPF:</Text>
                <TextInput 
                    style={styles.input} 
                    value={cpf} 
                    onChangeText={setCpf} 
                />
                
                <Text style={styles.label}>Endereço:</Text>
                <TextInput 
                    style={styles.input} 
                    value={endereco} 
                    onChangeText={setEndereco} 
                />
                
                <Text style={styles.label}>Senha:</Text>
                <TextInput 
                    style={styles.input} 
                    value={senha} 
                    onChangeText={setSenha} 
                    secureTextEntry
                />
                
                <Text style={styles.label}>Confirme a Senha:</Text>
                <TextInput 
                    style={styles.input} 
                    value={confirmeSenha} 
                    onChangeText={setConfirmeSenha} 
                    secureTextEntry
                />

                <Text style={styles.label}>Matrícula:</Text>
                <TextInput 
                    style={styles.input} 
                    value={matricula} 
                    onChangeText={setMatricula} 
                />

                <Button title="Salvar" onPress={salvarDados} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    perfilBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    fotoPerfil: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    fotoPerfilPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    placeholderText: {
        color: '#fff',
        textAlign: 'center',
    },
    nomePerfil: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    form: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 8,
        elevation: 1,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 4,
        marginBottom: 20,
    },
});
