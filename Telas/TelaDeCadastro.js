import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Button, Input, Text, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { MaskedTextInput } from 'react-native-mask-text';

export default function TelaDeCadastro({ navigation }) {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        endereco: "",
        senha: "",
        confirmeSenha: "",
        isAdmin: false, // Novo campo para verificar se é administrador
        matricula: "",  // Campo para a matrícula
    });
    const [loading, setLoading] = useState(false);
    const [senhaVisible, setSenhaVisible] = useState(false);
    const [confirmeSenhaVisible, setConfirmeSenhaVisible] = useState(false);

    const createUser = async () => {
        try {
            const response = await fetch('http://192.168.0.74:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json(); // Captura a resposta em JSON

            if (!response.ok) {
                console.error(data); // Log do erro
                throw new Error(data.error || 'Erro ao cadastrar usuário');
            }

            return data;
        } catch (error) {
            console.error("Erro:", error); // Log de erros
            throw error;
        }
    };

    const validarCampos = () => {
        const { nome, email, telefone, cpf, endereco, senha, confirmeSenha, isAdmin, matricula } = form;
        if (!nome || !email || !telefone || !cpf || !endereco || !senha || !confirmeSenha) {
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            return false;
        }
        if (senha !== confirmeSenha) {
            Alert.alert("Erro", "As senhas não correspondem!");
            return false;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Alert.alert("Erro", "Email inválido!");
            return false;
        }
        // Implementar validação para CPF
        if (!validarCPF(cpf)) {
            Alert.alert("Erro", "CPF inválido!");
            return false;
        }
        // Validação da matrícula se o usuário for servidor público
        if (isAdmin && !matricula) {
            Alert.alert("Erro", "O campo de matrícula é obrigatório para servidores públicos!");
            return false;
        }
        return true;
    };

    const validarCPF = (cpf) => {
        // Lógica básica para validação de CPF
        return cpf.replace(/\D/g, '').length === 11; // Exemplo simplificado
    };

    const cadastrar = async () => {
        if (!validarCampos()) return;

        setLoading(true); // Inicia o carregamento
        try {
            await createUser();
            Alert.alert("Tudo Certo!", "Usuário cadastrado com sucesso!");
            navigation.navigate("TelaDeLogin");
        } catch (error) {
            Alert.alert("Erro", error.message || "Ocorreu um erro ao cadastrar o usuário.");
        } finally {
            setLoading(false); // Para o carregamento
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
            <ScrollView>
                <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                    <Text style={styles.message}>Bem-vindo à sua tela de cadastro!</Text>
                </Animatable.View>

                <Animatable.View animation="fadeIn" delay={900} style={styles.containerForm}>
                    <InputField 
                        label="Nome*" 
                        placeholder="Digite seu Nome" 
                        value={form.nome} 
                        onChangeText={text => setForm(prev => ({ ...prev, nome: text }))} 
                    />
                    <InputField 
                        label="CPF*" 
                        placeholder="Digite seu CPF" 
                        value={form.cpf} 
                        onChangeText={text => setForm(prev => ({ ...prev, cpf: text }))} 
                        mask="999.999.999-99" 
                    />
                    <InputField 
                        label="Email*" 
                        placeholder="Digite seu Email" 
                        value={form.email} 
                        onChangeText={text => setForm(prev => ({ ...prev, email: text }))} 
                        keyboardType="email-address" 
                    />
                    <InputField 
                        label="Telefone*" 
                        placeholder="Digite seu Telefone" 
                        value={form.telefone} 
                        onChangeText={text => setForm(prev => ({ ...prev, telefone: text }))} 
                        mask="(99) 99999-9999" 
                    />
                    <InputField 
                        label="Endereço*" 
                        placeholder="Digite seu Endereço" 
                        value={form.endereco} 
                        onChangeText={text => setForm(prev => ({ ...prev, endereco: text }))} 
                    />
                    <InputField 
                        label="Senha*" 
                        placeholder="Digite sua Senha" 
                        value={form.senha} 
                        secureTextEntry={!senhaVisible} 
                        onChangeText={text => setForm(prev => ({ ...prev, senha: text }))} 
                        rightIcon={{ 
                            name: senhaVisible ? "eye" : "eye-slash", 
                            onPress: () => setSenhaVisible(!senhaVisible) 
                        }} 
                    />
                    <InputField 
                        label="Confirme a Senha*" 
                        placeholder="Confirme sua Senha" 
                        value={form.confirmeSenha} 
                        secureTextEntry={!confirmeSenhaVisible} 
                        onChangeText={text => setForm(prev => ({ ...prev, confirmeSenha: text }))} 
                        rightIcon={{ 
                            name: confirmeSenhaVisible ? "eye" : "eye-slash", 
                            onPress: () => setConfirmeSenhaVisible(!confirmeSenhaVisible) 
                        }} 
                    />
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            title="Sou Servidor Público (Administrador)"
                            checked={form.isAdmin}
                            onPress={() => setForm(prev => ({ ...prev, isAdmin: !prev.isAdmin }))}
                        />
                    </View>
                    {/* Campo para matrícula, exibido apenas se o checkbox estiver marcado */}
                    {form.isAdmin && (
                        <InputField 
                            label="Matrícula*" 
                            placeholder="Digite sua Matrícula" 
                            value={form.matricula} 
                            onChangeText={text => setForm(prev => ({ ...prev, matricula: text }))} 
                        />
                    )}
                    <Button
                        icon={<Icon name="user" size={15} color="white" />}
                        title={loading ? "Cadastrando..." : "Salvar"}
                        buttonStyle={specificStyle.button}
                        onPress={cadastrar}
                        disabled={loading} // Desabilita o botão enquanto carrega
                    />
                </Animatable.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const InputField = ({ label, placeholder, value, onChangeText, secureTextEntry, rightIcon, mask, keyboardType }) => (
    <>
        <Text style={styles.title}>{label}</Text>
        {mask ? (
            <MaskedTextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                mask={mask}
                keyboardType={keyboardType || "default"}
                style={styles.input}
            />
        ) : (
            <Input
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                rightIcon={rightIcon ? <Icon name={rightIcon.name} onPress={rightIcon.onPress} /> : null}
                containerStyle={styles.inputContainer}
            />
        )}
    </>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3e606f'
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff'
    },
    containerForm: {
        backgroundColor: '#fff',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
        paddingBottom: 20, // Adicionando um padding extra na parte inferior
    },
    title: {
        fontSize: 20,
        marginTop: 18,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
    },
    input: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
    },
    checkboxContainer: {
        marginBottom: 15,
    },
});

const specificStyle = StyleSheet.create({
    button: {
        backgroundColor: '#3e606f',
        width: '100%',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 15,
    }
});
