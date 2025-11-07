 
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TransactionCard = ({ item }) => {
  const { category, amount, type, date } = item;
  const isExpense = type === 'expense';

  return (
    <View style={[styles.card, isExpense ? styles.expenseCard : styles.incomeCard]}>
      <View style={styles.row}>
        <Icon
          name={isExpense ? 'arrow-up-bold' : 'arrow-down-bold'}
          size={22}
          color={isExpense ? '#E53935' : '#43A047'}
        />
        <View style={styles.info}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={[styles.amount, isExpense ? styles.expense : styles.income]}>
          {isExpense ? '-' : '+'} ₹{amount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: '#666',
    fontSize: 13,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  expense: { color: '#E53935' },
  income: { color: '#43A047' },
  expenseCard: { borderLeftWidth: 4, borderLeftColor: '#E53935' },
  incomeCard: { borderLeftWidth: 4, borderLeftColor: '#43A047' },
});

export default TransactionCard;
