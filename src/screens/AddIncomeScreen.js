import React, {useState, useRef} from 'react';
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
import {firebaseAuth} from '../services/firebaseConfig';
import budgetService from '../features/budgetService';
import {heightPercentageToDP} from '../utils/helpers';
import {colors} from '../utils/theme';

const optionsPaidBy = ['Father', 'Mother', 'Son', 'Daughter'];
const optionsCategory = [
  'Monthly Salary',
  'Part-time wages',
  'Bank Interest',
  'Dividends',
  'Rental Income',
  'Annuity Income',
];

const Dropdown = ({label, options, selectedValue, onValueChange}) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = value => {
    onValueChange(value);
    setVisible(false);
  };

  return (
    <View style={{marginBottom: heightPercentageToDP('2%'), zIndex: visible ? 1000 : 1}}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setVisible(!visible)}>
        <Text style={{color: selectedValue ? '#000' : '#9CA3AF', flex: 1}}>
          {selectedValue || 'Select'}
        </Text>
        <Text style={styles.dropdownArrow}>{visible ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {visible && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setVisible(false)}
            activeOpacity={1}
          />
          <View style={styles.dropdown}>
            <ScrollView nestedScrollEnabled>
              {options.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionItem}
                  onPress={() => handleSelect(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

const AddIncomeScreen = ({navigation}) => {
  const [familyMember, setFamilyMember] = useState('');
  const [relationToFamily, setRelationToFamily] = useState('');
  const [incomeSourceType, setIncomeSourceType] = useState('');
  const [description, setDescription] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [frequencyIncome, setFrequencyIncome] = useState('');
  const [dateRecevied, setDateRecevied] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    // Validate required fields
    if (!familyMember.trim()) {
      Alert.alert('Validation Error', 'Please enter family member Name');
      return;
    }
    
    if (
      relationToFamily === undefined ||
      relationToFamily === null ||
      relationToFamily === ''
    ) {
      Alert.alert('Validation Error', 'Please Select the relation');
      return;
    }

    // Check if user is logged in
    const user = firebaseAuth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      navigation.replace('Login');
      return;
    }

    const month = new Date().toISOString().slice(0, 7);

    const incomeData = {
      familyMember: familyMember.trim(),
      date: new Date().toISOString(),
      relationToFamily,
      incomeSourceType,
      description: description.trim(),
      amount: incomeAmount,
      frequencyIncome,
      dateRecevied: dateRecevied.trim(),
      paymentMethod,
      categoryType: categoryType,
      month: month,
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
            setIncomeAmount('');
            setFrequencyIncome('');
            setDateRecevied('');
            setPaymentMethod('');
            setCategoryType('');
            // Navigate back to dashboard
            navigation.goBack();
          },
        },
      ]);
    } catch (err) {
      console.error('Error adding income:', err);
      Alert.alert('Error', 'Failed to add income. Please try again.');
    } finally {
      setLoading(false);
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
          <Text style={styles.heading}>Add Income</Text>

          <Text style={styles.label}>Family Member Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Family Member Name"
            placeholderTextColor="#9CA3AF"
            value={familyMember}
            onChangeText={text => setFamilyMember(text)}
          />

          <Dropdown
            label="Relation to Family Head"
            options={optionsPaidBy}
            selectedValue={relationToFamily}
            onValueChange={text => setRelationToFamily(text)}
          />

          <Dropdown
            label="Income Source Type"
            options={optionsCategory}
            selectedValue={incomeSourceType}
            onValueChange={text => setIncomeSourceType(text)}
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

          <Dropdown
            label="Frequency of Income"
            options={['Daily', 'Weekly', 'Monthly', 'Yearly']}
            selectedValue={frequencyIncome}
            onValueChange={n => setFrequencyIncome(n)}
          />

          <Dropdown
            label="Payment Method"
            options={['Cash', 'Bank Transfer', 'UPI', 'Cheque']}
            selectedValue={paymentMethod}
            onValueChange={n => setPaymentMethod(n)}
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

          <Text style={styles.label}>Income Date Received</Text>
          <TextInput
            style={styles.input}
            placeholder="Income Date Received"
            placeholderTextColor="#9CA3AF"
            value={dateRecevied}
            onChangeText={text => setDateRecevied(text)}
          />

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
    flexDirection: 'row',
    alignItems: 'center',
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
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
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