 
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { handleRegister } from '../features/auth/authSlice';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.auth);

  const onRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const result = await dispatch(handleRegister({email, password}));
    if (result.meta.requestStatus === 'fulfilled') {
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Home');
    } else {
      Alert.alert('Registration Failed', result.payload || 'Unknown error');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl font-bold mb-6">Register</Text>

      <TextInput
        className="border w-full p-3 rounded-lg mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border w-full p-3 rounded-lg mb-6"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={onRegister}
        className="bg-green-600 rounded-lg px-6 py-3 w-full">
        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center font-semibold">Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text className="text-blue-600 mt-4">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
