import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity, Text as RNText, ActivityIndicator } from "react-native";
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function TelaDeLogin() {
    const navigation = useNavigation();

    const [data, setData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Estado para loading

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    const isValidPassword = (password) => password.length >= 6;

    const loginUser = async () => {
        try {
            setLoading(true); // Inicia o loading
            const response = await fetch('http://192.168.0.48:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, senha: data.password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Email ou senha inválidos!');
            }

            return await response.json(); // Assegure-se de que isso inclui o nível de usuário
        } catch (error) {
            console.error(error);
            throw new Error('Erro ao realizar login: ' + error.message);
        } finally {
            setLoading(false); // Para o loading
        }
    };

    const entrar = async () => {
        setError("");

        if (!data.email || !data.password) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        if (!isValidEmail(data.email)) {
            setError("E-mail inválido.");
            return;
        }

        if (!isValidPassword(data.password)) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            const result = await loginUser();
            Alert.alert("Sucesso", "Login realizado com sucesso!");

            // Verifica se o usuário é administrador e navega para a tela apropriada
            if (result.user.nivel === 1) { // Considerando que 1 é o nível de administrador
                navigation.navigate("TelaAdmin");
            } else {
                navigation.navigate("TelaPrincipal", { user: result.user });
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const cadastrar = () => navigation.navigate("TelaDeCadastro");
    const recuperarSenha = () => navigation.navigate("TelaDeRecuperacaoSenha");

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
                    placeholderTextColor="#A9A9A9"
                />

                <Text style={styles.title}>Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Digite a sua Senha"
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        onChangeText={e => setData(prev => ({ ...prev, password: e }))}
                        placeholderTextColor="#A9A9A9"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon name={showPassword ? "eye" : "eye-slash"} size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {error ? <RNText style={styles.errorText}>{error}</RNText> : null}

                {loading ? ( // Indicador de carregamento
                    <ActivityIndicator size="large" color="#3e606f" style={styles.loadingIndicator} />
                ) : (
                    <>
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

                        <TouchableOpacity onPress={recuperarSenha}>
                            <Text style={styles.recoverPasswordText}>Recuperar Senha</Text>
                        </TouchableOpacity>
                    </>
                )}
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
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    title: {
        fontSize: 20,
        marginTop: 28,
        color: '#3e606f',
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
        borderColor: '#3e606f',
        paddingHorizontal: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    recoverPasswordText: {
        color: '#3e606f',
        marginTop: 15,
        textAlign: 'center',
    },
    loadingIndicator: {
        marginVertical: 20,
    },
});

const specificStyle = StyleSheet.create({
    button: {
        backgroundColor: '#3e606f',
        width: '100%',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 15,
        elevation: 3,
    },
});
