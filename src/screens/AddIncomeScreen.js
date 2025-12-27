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
  View
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import budgetService from '../features/budgetService';
import { firebaseAuth } from '../services/firebaseConfig';
import { formatDate, heightPercentageToDP } from '../utils/helpers';
import { colors } from '../utils/theme';
import { AppDropdown } from './AddExpenseForm';

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

const frequencyOptions = [
  {label: 'Daily', value: 'Daily'},
  {label: 'Weekly', value: 'Weekly'},
  {label: 'Monthly', value: 'Monthly'},
  {label: 'Yearly', value: 'Yearly'},
];

const paymentMethods = [
  {label: 'Cash', value: 'Cash'},
  {label: 'Bank Transfer', value: 'Bank Transfer'},
  {label: 'UPI', value: 'UPI'},
  {label: 'Cheque', value: 'Cheque'},
];

const AddIncomeScreen = ({navigation}) => {
  const [familyMember, setFamilyMember] = useState('');
  const [relationToFamily, setRelationToFamily] = useState('');
  const [incomeSourceType, setIncomeSourceType] = useState('');
  const [description, setDescription] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [frequencyIncome, setFrequencyIncome] = useState('');
  const [dateReceived, setDateReceived] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    // Validate required fields
    console.log('1');

    if (!familyMember.trim()) {
      Alert.alert('Validation Error', 'Please enter family member Name');
      return;
    }
    console.log('2');
    if (
      relationToFamily === undefined ||
      relationToFamily === null ||
      relationToFamily === ''
    ) {
      Alert.alert('Validation Error', 'Please Select the relation');
      return;
    }
    console.log('3');
    // if (!category) {
    //   Alert.alert('Validation Error', 'Please select a category');
    //   return;
    // }

    // Check if user is logged in
    const user = firebaseAuth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      navigation.replace('Login');
      return;
    }
    if (!dateReceived) {
      Alert.alert('Validation Error', 'Please select income date');
      return;
    }

    console.log('4');
    // Validate amount is a valid number
    // const parsedAmount = parseFloat(amount);
    // if (isNaN(parsedAmount) || parsedAmount <= 0) {
    //   Alert.alert('Validation Error', 'Please enter a valid amount');
    //   return;
    // }
    const incomeDateISO = new Date(dateReceived).toISOString();
    const month = incomeDateISO.slice(0, 7);

    console.log('5');
    const incomeData = {
      familyMember: familyMember.trim(),
      relationToFamily,
      incomeSourceType,
      date: incomeDateISO,
      dateRecevied: incomeDateISO,
      month,
      description: description.trim(),
      amount: incomeAmount,
      frequencyIncome,
      paymentMethod,
      categoryType: categoryType,
      type: 'Income',
    };

    console.log('incomeData...!', incomeData);

    setLoading(true);
    try {
      await budgetService.addIncome(incomeData);
      Alert.alert('Success', 'Income added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setFamilyMember('');
            setRelationToFamily('');
            setIncomeSourceType('');
            setDescription('');
            setDescription('');
            setIncomeAmount('');
            setFrequencyIncome('');
            setDateReceived(null);
            setPaymentMethod('');
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
    setDateReceived(date);
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
          <Text style={styles.heading}>Add Income</Text>

          <Text style={styles.label}>Family Member Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Family Member Name"
            placeholderTextColor="#9CA3AF"
            value={familyMember}
            onChangeText={text => setFamilyMember(text)}
          />

          <AppDropdown
            label="Relation to Family Head"
            data={optionsPaidBy}
            value={relationToFamily}
            onChange={setRelationToFamily}
          />

          <AppDropdown
            label="Income Source Type"
            data={optionsCategory}
            value={incomeSourceType}
            onChange={setIncomeSourceType}
          />

          <Text style={styles.label}>Income Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Details..."
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={text => setDescription(text)}
            multiline
          />
          <AppDropdown
            label="Frequency of Income"
            data={frequencyOptions}
            value={frequencyIncome}
            onChange={setFrequencyIncome}
          />

          <AppDropdown
            label="Payment Method"
            data={paymentMethods}
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          <Text style={styles.label}>Income Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="₹2,350"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={incomeAmount}
            onChangeText={n => setIncomeAmount(n)}
          />

          <Text style={styles.label}>Income Date Received *</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setCalendarVisible(true)}>
            <Text style={{color: dateReceived ? '#000' : '#9CA3AF'}}>
              {dateReceived ? formatDate(dateReceived) : 'Select Date'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Income Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Income Category type"
            placeholderTextColor="#9CA3AF"
            value={categoryType}
            onChangeText={n => setCategoryType(n)}
          />
          <TouchableOpacity
            style={[styles.button, {opacity: loading ? 0.7 : 1}]}
            onPress={handleAddExpense}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Adding...' : 'Add Income'}
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
              <Text style={styles.modalTitle}>Select Income Date</Text>

              <CalendarPicker
                onDateChange={onDateChange}
                selectedStartDate={dateReceived}
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

export default AddIncomeScreen;

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
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    maxHeight: 200,
    marginTop: 4,
    zIndex: 999,
    elevation: 5,
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

  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
});
