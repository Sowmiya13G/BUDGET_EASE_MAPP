import React, {useState} from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {handleSetPassword} from '../features/auth/authSlice';

const SetPasswordModal = ({visible, onClose}) => {
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.auth);

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      Alert.alert('Password must be at least 6 characters');
      return;
    }
    try {
      await dispatch(handleSetPassword({password})).unwrap();
      Alert.alert('Password set successfully');
      onClose();
    } catch (err) {
      Alert.alert(err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 12,
            width: '80%',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 12}}>
            Set Password
          </Text>
          <TextInput
            placeholder="New Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: '#4f46e5',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              {loading ? 'Saving...' : 'Set Password'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{marginTop: 12, alignItems: 'center'}}>
            <Text style={{color: '#4b5563'}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SetPasswordModal;
