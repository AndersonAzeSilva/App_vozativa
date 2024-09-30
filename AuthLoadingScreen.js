import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AuthLoadingScreen = () => {
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                // Token encontrado, redireciona para a TelaPrincipal
                navigation.navigate('TelaPrincipal');
            } else {
                // Sem token, redireciona para a tela de login
                navigation.navigate('TelaDeLogin');
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#3e606f" />;
    }

    return <View />;
};

export default AuthLoadingScreen;
