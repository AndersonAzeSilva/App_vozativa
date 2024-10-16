import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native";

import * as Animatable from 'react-native-animatable' //importando a animação que foi instalada
import { useNavigation } from '@react-navigation/native'

export default function TelaInicio() {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>

            <View style={styles.containerLogo}>
                <Animatable.Image //adicionando uma animação a imagem
                    delay={900} animation="zoomInUp"//criando uma propriedade para animação //exemplo de animações zommInUp
                    source={require('../image/Logomao.png')} //adicionando a logo
                    style={{ width: '100%' }}
                    resizeMode="contain"
                />
            </View>

            <Animatable.View delay={1100} animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>No APP VozAtiva, você pode mais.</Text>
                <Text> Faça o login para começar</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('TelaDeLogin')} //chamando a minha tela de login ao clicar no botão de Login
                >
                    <Text style={styles.buttonText}>Começar</Text>
                </TouchableOpacity>
            </Animatable.View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3e606f'
    },
    containerLogo: {
        flex: 2,
        backgroundColor: '#3e606f', //cor do container da logo
        justifyContent: 'center', //centralizando a logo
        alignItems: 'center' //alinhando a logo ao centro do container
    },
    containerForm: {
        flex: 1,
        backgroundColor: '#fff', //cor do container inferior
        borderTopLeftRadius: 25, //bordas arredondadas em cima na esquerda
        borderTopRightRadius: 25, //bordas arredondadas em cima na direita
        paddingStart: '5%', //Adicionando um espaçamento interno no começo
        paddingEnd: '5%' //Adicionando um espaçamento interno no final
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12,
    },
    //Adicionando estilo ao terceiro texto
    Text: {
        color: '#a1a1a1'
    },
    //Pesonalizando o botão de logar
    button: {
        position: 'absolute',
        backgroundColor: '#3e606f',
        borderRadius: 50,
        paddingVertical: 10, //adicionando um espaçamento interno
        paddingLeft: 25, //aumentando a borda esquerda do botão Login
        paddingRight: 25, //aumentando a borda direita do botão Login
        width: '60',
        alignSelf: 'center', //colocando o botão ao centro
        bottom: '15%',
        alignContent: 'center', //alinhando o que tem dentro dele no centro
        justifyContent: 'center' //alinhando o que tem dentro dele no centro
    },
    //Personalizando o texto do botão
    buttonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold'
    }
})