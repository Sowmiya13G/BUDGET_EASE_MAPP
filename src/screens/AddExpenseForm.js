import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { firebaseDatabase } from '../../firebase.config';

const AddExpenseScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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
        date: date.toLocaleDateString(),
        paidBy,
        category,
        description,
        amount: parseFloat(amount),
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

  return (
    <ScrollView className="flex-1 bg-gray-50 p-5">
      <Text className="text-3xl font-bold mb-6 text-center text-gray-800">Add Expense</Text>

      {/* Expense Title */}
      <View className="bg-white rounded-xl shadow p-4 mb-4">
        <View className="flex-row items-center mb-2">
          <Text className="ml-2 text-gray-700 font-semibold">Expense Title</Text>
        </View>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Grocery Shopping"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Date Picker */}
      {/* <View className="bg-white rounded-xl shadow p-4 mb-4">
        <View className="flex-row items-center mb-2">
          <Text className="ml-2 text-gray-700 font-semibold">Date of Expense</Text>
        </View>
        <TouchableOpacity
          className="border border-gray-300 rounded-lg p-3 flex-row justify-between items-center"
          onPress={() => setShowDatePicker(true)}>
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </View>

      <View className="bg-white rounded-xl shadow p-4 mb-4">
        <View className="flex-row items-center mb-2">
          <Text className="ml-2 text-gray-700 font-semibold">Paid By</Text>
        </View>
        <View className="border border-gray-300 rounded-lg">
          <Picker selectedValue={paidBy} onValueChange={itemValue => setPaidBy(itemValue)}>
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Father" value="Father" />
            <Picker.Item label="Mother" value="Mother" />
            <Picker.Item label="Son" value="Son" />
            <Picker.Item label="Daughter" value="Daughter" />
          </Picker>
        </View>
      </View> */}

      {/* Category */}
      <View className="bg-white rounded-xl shadow p-4 mb-4">
        <View className="flex-row items-center mb-2">
          <Text className="ml-2 text-gray-700 font-semibold">Category</Text>
        </View>
        <View className="border border-gray-300 rounded-lg">
          <Picker selectedValue={category} onValueChange={itemValue => setCategory(itemValue)}>
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Food & Groceries" value="Food & Groceries" />
            <Picker.Item label="Bills & Utilities" value="Bills" />
            <Picker.Item label="Education" value="Education" />
            <Picker.Item label="Healthcare" value="Medical" />
            <Picker.Item label="Transport" value="Transport" />
          </Picker>
        </View>
      </View>

      {/* Description */}
      <View className="bg-white rounded-xl shadow p-4 mb-4">
        <View className="flex-row items-center mb-2">
          <Text className="ml-2 text-gray-700 font-semibold">Description</Text>
        </View>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 h-24 text-gray-700"
          placeholder="Details..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Amount */}
      <View className="bg-white rounded-xl shadow p-4 mb-6">
        <View className="flex-row items-center mb-2">
          <Text className="ml-2 text-gray-700 font-semibold">Expense Amount</Text>
        </View>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="₹2,350"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 rounded-xl shadow-lg"
        onPress={handleAddExpense}>
        <Text className="text-center text-white font-bold text-lg">Add Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddExpenseScreen;
