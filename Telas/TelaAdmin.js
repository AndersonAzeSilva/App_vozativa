import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const TelaAdmin = ({ navigation }) => {
    // Exemplo de dados de usuários para exibição
    const usuarios = [
        { id: '1', nome: 'Usuário 1' },
        { id: '2', nome: 'Usuário 2' },
        { id: '3', nome: 'Usuário 3' },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.nome}</Text>
            <TouchableOpacity 
                style={styles.detailsButton} 
                onPress={() => navigation.navigate('TelaUsuarios', { usuarioId: item.id })}
            >
                <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Painel do Administrador</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaChamados')}>
                    <Text style={styles.buttonText}>Gerenciar Ocorrências</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaHistorico')}>
                    <Text style={styles.buttonText}>Ver Histórico de Ocorrências</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaNotificacoes')}>
                    <Text style={styles.buttonText}>Notificações</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaRelatorios')}>
                    <Text style={styles.buttonText}>Relatórios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaComentarios')}>
                    <Text style={styles.buttonText}>Comentários</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaImportarExportar')}>
                    <Text style={styles.buttonText}>Importar/Exportar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subTitle}>Usuários Cadastrados</Text>
            <FlatList
                data={usuarios}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    buttonContainer: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    subTitle: {
        fontSize: 22,
        marginVertical: 10,
        fontWeight: 'bold',
        color: '#555',
    },
    listContainer: {
        paddingBottom: 20,
    },
    item: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    detailsButton: {
        backgroundColor: '#6C757D',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    detailsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default TelaAdmin;
