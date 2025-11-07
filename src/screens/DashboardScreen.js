 
import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '../components/Header';
import TransactionCard from '../components/TransactionCard';
import BudgetCard from '../components/BudgetCard';

export default function DashboardScreen() {
  const transactions = [
    { id: 1, category: 'Groceries', amount: 1200, type: 'expense', date: '2025-11-07' },
    { id: 2, category: 'Salary', amount: 45000, type: 'income', date: '2025-11-01' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f5f7' }}>
      <Header title="Dashboard" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <BudgetCard category="Groceries" spent={1200} limit={8000} />
        <BudgetCard category="Bills" spent={2000} limit={5000} />

        {transactions.map(tx => (
          <TransactionCard key={tx.id} item={tx} />
        ))}
      </ScrollView>
    </View>
  );
}
