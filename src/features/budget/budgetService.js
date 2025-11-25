 
// services/budgetService.js
import {firebaseDatabase} from '../../firebase.config';

const BUDGET_REF = '/expenses';

const budgetService = {
  addExpense: async (expense) => {
    try {
      const newRef = await firebaseDatabase.ref(BUDGET_REF).push(expense);
      return { id: newRef.key, ...expense };
    } catch (error) {
      throw error;
    }
  },

  getExpenses: async () => {
    try {
      const snapshot = await firebaseDatabase.ref(BUDGET_REF).once('value');
      const data = snapshot.val() || {};
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } catch (error) {
      throw error;
    }
  },

  updateExpense: async (id, updates) => {
    try {
      await firebaseDatabase.ref(`${BUDGET_REF}/${id}`).update(updates);
      return { id, ...updates };
    } catch (error) {
      throw error;
    }
  },

  deleteExpense: async (id) => {
    try {
      await firebaseDatabase.ref(`${BUDGET_REF}/${id}`).remove();
      return id;
    } catch (error) {
      throw error;
    }
  },
};

export default budgetService;
