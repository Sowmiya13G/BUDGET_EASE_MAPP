import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Dropdown from '../components/Dropdown';
import {addExpense} from '../features/budget/budgetSlice';
import {heightPercentageToDP} from '../utils/helpers';
import {colors} from '../utils/theme';

const optionsPaidBy = ['Father', 'Mother', 'Son', 'Daughter'];
const optionsCategory = [
  'Food & Groceries',
  'Bills & Utilities',
  'Education',
  'Healthcare',
  'Transport',
];

const AddExpenseScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = async () => {
    if (!title || !amount || !category || !paidBy) {
      Alert.alert('Please fill all required fields');
      return;
    }

    const expenseData = {
      title,
      date: new Date().toISOString(),
      paidBy,
      category,
      description,
      amount: parseFloat(amount),
      createdAt: new Date().toISOString(),
    };

    try {
      await dispatch(addExpense({expense: expenseData})).unwrap();
      Alert.alert('Expense Added Successfully!');
      setTimeout(() => {
        navigation.goBack();
      }, 5000);
    } catch (err) {
      Alert.alert('Error', 'Failed to add expense');
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 32}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F3F4F6', padding: 16},
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
  textArea: {height: 100, textAlignVertical: 'top'},
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
