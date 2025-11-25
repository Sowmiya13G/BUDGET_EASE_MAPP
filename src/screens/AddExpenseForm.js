import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {firebaseDatabase} from '../../firebase.config';
import {heightPercentageToDP} from '../utils/helpers';
import {colors} from '../utils/theme';
import Dropdown from '../components/Dropdown';

const optionsPaidBy = ['Father', 'Mother', 'Son', 'Daughter'];
const optionsCategory = [
  'Food & Groceries',
  'Bills & Utilities',
  'Education',
  'Healthcare',
  'Transport',
];

const AddExpenseScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = () => {
    if (!title || !amount || !category || !paidBy) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    firebaseDatabase
      .ref('/expenses')
      .push({
        title,
        date: new Date().toISOString(),
        paidBy,
        category,
        description,
        amount: parseFloat(amount),
        createdAt: new Date().toISOString(),
      })
      .then(() => {
        Alert.alert('Success', 'Expense Added Successfully!');
        navigation.goBack();
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to add expense');
        console.error(error);
      });
  };

  const renderBody = () => {
    return (
      <View
        style={styles.container}
        contentContainerStyle={{paddingBottom: 32}}>
        <Text style={styles.heading}>Add Expense</Text>

        <Text style={styles.label}>Expense Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Grocery Shopping"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
        />

        <Dropdown
          label="Paid By"
          options={optionsPaidBy}
          selectedValue={paidBy}
          onValueChange={setPaidBy}
        />

        <Dropdown
          label="Category"
          options={optionsCategory}
          selectedValue={category}
          onValueChange={setCategory}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Details..."
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Expense Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="₹2,350"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{paddingBottom: 32}}
      keyboardShouldPersistTaps="handled">
      {renderBody()}
    </ScrollView>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: heightPercentageToDP('1%'),
    fontWeight: '600',
    marginTop: heightPercentageToDP('1.5%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 32,
    marginTop: heightPercentageToDP('2%'),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
