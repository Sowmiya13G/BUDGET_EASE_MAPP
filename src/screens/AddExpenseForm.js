import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Dropdown } from 'react-native-element-dropdown';
import budgetService from '../features/budgetService';
import { firebaseAuth } from '../services/firebaseConfig';
import { formatDate, heightPercentageToDP } from '../utils/helpers';
import { colors } from '../utils/theme';

const optionsPaidBy = [
  {label: 'Father', value: 'Father'},
  {label: 'Mother', value: 'Mother'},
  {label: 'Son', value: 'Son'},
  {label: 'Daughter', value: 'Daughter'},
];

const optionsCategory = [
  {label: 'Monthly Salary', value: 'Monthly Salary'},
  {label: 'Part-time wages', value: 'Part-time wages'},
  {label: 'Bank Interest', value: 'Bank Interest'},
  {label: 'Dividends', value: 'Dividends'},
  {label: 'Rental Income', value: 'Rental Income'},
  {label: 'Annuity Income', value: 'Annuity Income'},
];

export const AppDropdown = ({label, data, value, onChange, placeholder}) => {
  return (
    <View style={{marginBottom: heightPercentageToDP('2%')}}>
      <Text style={styles.label}>{label}</Text>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder || 'Select'}
        searchPlaceholder="Search..."
        value={value}
        onChange={item => onChange(item.value)}
      />
    </View>
  );
};

const AddExpenseScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const handleAddExpense = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter expense title');
      return;
    }
    if (!amount.trim()) {
      Alert.alert('Validation Error', 'Please enter expense amount');
      return;
    }
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category');
      return;
    }
    if (!paidBy) {
      Alert.alert('Validation Error', 'Please select who paid');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Validation Error', 'Please select expense date');
      return;
    }

    // Check if user is logged in
    const user = firebaseAuth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      navigation.replace('Login');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return;
    }
    const formattedDateISO = new Date(selectedDate).toISOString();
    const month = formattedDateISO.slice(0, 7);

    const expenseData = {
      title: title.trim(),
      date: formattedDateISO,
      paidBy,
      category,
      description: description.trim(),
      amount: parsedAmount,
      month,
      type: 'Expense',
    };

    setLoading(true);
    try {
      await budgetService.addExpense(expenseData);
      Alert.alert('Success', 'Expense added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setTitle('');
            setPaidBy('');
            setCategory('');
            setDescription('');
            setAmount('');
            // Navigate back to dashboard
            navigation.goBack();
          },
        },
      ]);
    } catch (err) {
      console.error('Error adding expense:', err);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = date => {
    setSelectedDate(date);
    setCalendarVisible(false);
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

          <Text style={styles.label}>Expense Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Grocery Shopping"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />

          <AppDropdown
            label="Paid By *"
            options={optionsPaidBy}
            selectedValue={paidBy}
            onValueChange={setPaidBy}
          />

          <AppDropdown
            label="Category *"
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

          <Text style={styles.label}>Expense Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="₹2,350"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.label}>Expense Date *</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setCalendarVisible(true)}>
            <Text style={{color: '#000'}}>
              {selectedDate ? formatDate(selectedDate) : 'Select Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {opacity: loading ? 0.7 : 1}]}
            onPress={handleAddExpense}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <Modal
          transparent
          animationType="fade"
          visible={calendarVisible}
          onRequestClose={() => setCalendarVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Date</Text>

              <CalendarPicker
                onDateChange={onDateChange}
                selectedStartDate={selectedDate}
                maxDate={new Date()}
              />

              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setCalendarVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginTop: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
  },

  placeholderStyle: {
    fontSize: 16,
    color: '#9CA3AF',
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
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
    color: '#000',
  },
  textArea: {height: 100, textAlignVertical: 'top'},
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: heightPercentageToDP('3%'),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: heightPercentageToDP('2%'),
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },

  modalCancel: {
    marginTop: 12,
    paddingVertical: 12,
  },

  modalCancelText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});
