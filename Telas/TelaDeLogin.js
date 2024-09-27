import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function TelaDeLogin() {
    const navigation = useNavigation();

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const loginUser = async () => {
        try {
            const response = await fetch('http://192.168.0.48:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: data.email, senha: data.password }), // Corrigido para usar 'senha'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Email ou senha inválidos!');
            }

            const result = await response.json();
            return result; // Retorna os dados do usuário ou um token, conforme a implementação da API
        } catch (error) {
            console.error(error);
            throw new Error('Erro ao realizar login: ' + error.message);
        }
    };

    const entrar = async () => {
        if (!data.email || !data.password) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        try {
            const result = await loginUser();
            Alert.alert("Sucesso", "Login realizado com sucesso!");
            // Aqui você pode armazenar o token ou os dados do usuário, se necessário
            // Exemplo: AsyncStorage.setItem('user', JSON.stringify(result.user));
            navigation.navigate("TelaPrincipal");
        } catch (error) {
            Alert.alert("Erro", error.message); // Exibe a mensagem de erro se houver
        }
    };

    const cadastrar = () => {
        navigation.navigate("TelaDeCadastro");
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Bem-Vindo(a)</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>E-mail</Text>
                <TextInput
                    placeholder="Digite o seu E-mail"
                    style={styles.input}
                    onChangeText={e => setData(prev => ({ ...prev, email: e }))}
                    keyboardType="email-address"
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                    placeholder="Digite a sua Senha"
                    style={styles.input}
                    secureTextEntry
                    onChangeText={e => setData(prev => ({ ...prev, password: e }))}
                />

                <Button
                    icon={<Icon name="check" size={15} color="white" />}
                    title="Entrar"
                    buttonStyle={specificStyle.button}
                    onPress={entrar}
                />

                <Button
                    icon={<Icon name="user" size={15} color="white" />}
                    title="Cadastrar"
                    buttonStyle={specificStyle.button}
                    onPress={cadastrar}
                />
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3e606f',
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    containerForm: {
        backgroundColor: '#fff',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    title: {
        fontSize: 20,
        marginTop: 28,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
});

const specificStyle = StyleSheet.create({
    button: {
        backgroundColor: '#3e606f',
        width: '100%',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 15,
    },
});