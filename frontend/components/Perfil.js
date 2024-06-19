import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const ProfilePage = () => {
  const { onLogout } = useAuth();
  const { authState } = useAuth();
  const { objeto } = authState;
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    CPF: '',
    workTitle: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (objeto) {
          const userData = JSON.parse(objeto);
          setUser({
            name: userData.name || '',
            email: userData.email || '',
            password: '', // Don't prefill password
            CPF: userData.CPF || '',
            workTitle: userData.workTitle || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const handleUpdateProfile = async () => {
    const updateData = {
      name: user.name,
      email: user.email,
      CPF: user.CPF,
      workTitle: user.workTitle,
    };
    if (user.password) {
      updateData.password = user.password;
    }
    try {
      const result = await axios.put('http://localhost:8080/api/v1/user/update', updateData);
      alert('Perfil atualizado com sucesso!');
      SecureStore.setItemAsync('user', JSON.stringify(result.data));
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Erro ao atualizar perfil.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/delete/${user.CPF}`);
      alert('Conta deletada com sucesso!');
      onLogout();
    } catch (error) {
      console.error('Error deleting account:', error.message);
      alert('Erro ao deletar conta.');
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja deletar sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { text: "Deletar", onPress: handleDeleteAccount }
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity onPress={confirmDeleteAccount} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Deletar Conta</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={user.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={user.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={user.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
        {user.CPF ? (
          <TextInput
            style={styles.input}
            placeholder="CPF"
            value={user.CPF}
            onChangeText={(value) => handleInputChange('CPF', value)}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Título de Trabalho"
            value={user.workTitle}
            onChangeText={(value) => handleInputChange('workTitle', value)}
          />
        )}
        <TouchableOpacity onPress={handleUpdateProfile} style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Atualizar Perfil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const AlturaStatusBar = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9E9D1',
    paddingTop: AlturaStatusBar + 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9E9D1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#463529',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F9E9D1',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    color: '#463529',
  },
  updateButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProfilePage;
