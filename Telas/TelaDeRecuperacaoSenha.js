// TelaDeRecuperacaoSenha.js

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from "react-native";
import { Button, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

export default function TelaDeRecuperacaoSenha() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");

    const recuperarSenha = async () => {
        if (!email) {
            Alert.alert("Erro", "Por favor, insira seu e-mail.");
            return;
        }

        try {
            const response = await fetch('http:// 192.168.0.74:3000/recuperar-senha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar solicitação de recuperação de senha.');
            }

            Alert.alert("Sucesso", "Instruções de recuperação de senha enviadas para o seu e-mail.");
            navigation.navigate("TelaDeLogin"); // Redireciona de volta para a tela de login
        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Recuperar Senha</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>E-mail</Text>
                <TextInput
                    placeholder="Digite o seu E-mail"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholderTextColor="#A9A9A9"
                />

                <Button
                    icon={<Icon name="check" size={15} color="white" />}
                    title="Recuperar Senha"
                    buttonStyle={styles.button}
                    onPress={recuperarSenha}
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
    button: {
        backgroundColor: '#3e606f',
        width: '100%',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 15,
        elevation: 3, 
    },
});
