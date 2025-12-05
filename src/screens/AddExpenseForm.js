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

const Dropdown = ({label, options, selectedValue, onValueChange}) => {
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const inputRef = useRef(null);

  const handleSelect = value => {
    onValueChange(value);
    setVisible(false);
  };

  const toggleDropdown = () => {
    if (visible) {
      setVisible(false);
      return;
    }

    inputRef.current?.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
      setVisible(true);
    });
  };

  return (
    <View style={{marginBottom: heightPercentageToDP('2%')}}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        ref={inputRef}
        style={styles.input}
        onPress={toggleDropdown}>
        <Text>{selectedValue || 'Select'}</Text>
      </TouchableOpacity>

      {visible && (
        <View style={[styles.dropdown, {maxHeight: 200}]}>
          <ScrollView>
            {options.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.optionItem}
                onPress={() => handleSelect(item)}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const AddExpenseScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    if (!title || !amount || !category || !paidBy) {
      Alert.alert('Please fill all required fields');
      return;
    }

    const user = firebaseAuth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    const expenseData = {
      title,
      date: new Date().toISOString(),
      paidBy,
      category,
      description,
      amount: parseFloat(amount),
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    setLoading(true);
    try {
      await budgetService.addExpense(expenseData);
      Alert.alert('Success', 'Expense added successfully!');
      setTimeout(() => navigation.goBack(), 1000);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
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

          <TouchableOpacity
            style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleAddExpense}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Text>
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
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: heightPercentageToDP('1%'),
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  dropdown: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
});
