 
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const BudgetCard = ({ category, spent, limit }) => {
  const progress = Math.min(spent / limit, 1);
  const remaining = limit - spent;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.limit}>₹{limit}</Text>
      </View>
      <ProgressBar
        progress={progress}
        color={progress >= 0.9 ? '#E53935' : '#43A047'}
        style={styles.progress}
      />
      <Text style={styles.spent}>
        Spent ₹{spent} • Remaining ₹{remaining >= 0 ? remaining : 0}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  category: {
    fontWeight: '600',
    fontSize: 16,
  },
  limit: {
    fontWeight: '600',
    fontSize: 15,
    color: '#666',
  },
  progress: {
    height: 8,
    borderRadius: 10,
  },
  spent: {
    marginTop: 5,
    fontSize: 13,
    color: '#555',
  },
});

export default BudgetCard;
