import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const LoginScreen = () => {

    const [matricula, setMatricula] = useState('');
    const [useremail, setUseremail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!matricula || !useremail || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        // Aqui você pode adicionar a lógica para autenticar o usuário, por exemplo, uma chamada à API.
        Alert.alert('Sucesso', 'Login realizado com sucesso!'); //eximindo uma mensagem quando o usuário logar no sistema
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Portal do Servidor Público</Text>

            <TextInput
                style={styles.input}
                placeholder="Matricula do Usuário"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Nome de Usuário"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPasswordContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#007bff',
        fontSize: 14,
    },
});

export default LoginScreen;
