import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, View, Image, TextInput, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function TelaLoginServidor({ navigation }) {

    const [offset] = useState(new Animated.ValueXY({ x: 0, y: 95 }));
    const [opacity] = useState(new Animated.Value(0));
    const [logo] = useState(new Animated.ValueXY({ x: 130, y: 155 }));

    useEffect(() => {

        Animated.parallel([
            Animated.spring(offset.y, {
                toValue: 0,
                speed: 4,
                bounciness: 20,
                useNativeDriver: true
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();

    }, []);

    return (
        <KeyboardAvoidingView style={styles.cordefundo}>
            <View style={styles.containerLogo}>
                <Animated.Image
                    style={{
                        width: logo.x,
                        height: logo.y,
                        useNativeDriver: true
                    }}
                    source={require('../image/Logoservidor.png')}
                />
            </View>

            <Animated.View
                style={[
                    styles.containerprincipal,
                    {
                        opacity: opacity,
                        transform: [
                            { translateY: offset.y }
                        ]
                    }
                ]}
            >
                <Text style={styles.title}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    autoCorrect={false}
                    onChange={() => { }}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                    title="Senha" //Titulo do botão
                    style={styles.input}
                    placeholder="Senha"
                    autoCorrect={false}
                    onChange={() => { }}
                />

                <TouchableOpacity style={styles.bnt}>
                    <Text style={styles.textodobotao}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bntCadastrar}>
                    <Text style={styles.TextCadastrar}>Cadastrar conta gratuita</Text>
                </TouchableOpacity>

            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    cordefundo: {
        flex: 1,
        alignItems: 'center', //alinhando tudo ao centro do container
        justifyContent: 'center',
        backgroundColor: '#3e606f'
    },
    containerLogo: {
        flex: 1,
        justifyContent: 'center',
    },
    containerprincipal: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25, //bordas arredondadas em cima na esquerda
        borderTopRightRadius: 25, //bordas arredondadas em cima na direita
        paddingStart: '5%', //Passando um espaçamento interno
        paddingEnd: '5%',
        alignItems: 'center', //alinhando tudo ao centro do container
        justifyContent: 'center',
        width: '90%',
        paddingBottom: 100
    },
    input: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        width: '90%',
        marginBottom: 15, //espaçamento entre os botções
        color: '#222', //cor
        fontSize: 17,
        borderRadius: 7, //arrendodando as bordas
        padding: 10, //esáçamento entre os texto
    },
    title: {
        fontSize: 20,
        marginTop: 28,
    },
    bnt: {
        backgroundColor: '#35aaff',
        width: '90%',
        height: 45, //altura dos botões
        alignItems: 'center',
        justifyContent: 'center', //alinhando o texto dentro do botão
        borderRadius: 7 //borda do botão
    },
    textodobotao: {
        color: '#fff',
        fontSize: 18 //tamanho da fonte do texto do botão
    },
    bntCadastrar: {
        margin: 10,
    },
    TextCadastrar: {
        color: '#fff'
    }
});