import { firebaseDatabase } from '../services/firebaseConfig';
import { firebaseAuth } from '../services/firebaseConfig';

const budgetService = {
  /**
   * Add expense for the currently logged-in user
   */
  addExpense: async (expense) => {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const expenseWithUser = {
        ...expense,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };

      const newRef = firebaseDatabase.ref(`expenses/${user.uid}`).push();
      await newRef.set(expenseWithUser);
      
      return { id: newRef.key, ...expenseWithUser };
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },

  /**
   * Get all expenses for the currently logged-in user
   */
  getExpenses: async () => {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const snapshot = await firebaseDatabase
        .ref(`expenses/${user.uid}`)
        .once('value');
      
      const data = snapshot.val() || {};
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } catch (error) {
      console.error('Error getting expenses:', error);
      throw error;
    }
  },

  /**
   * Update expense for the currently logged-in user
   */
  updateExpense: async (id, updates) => {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await firebaseDatabase
        .ref(`expenses/${user.uid}/${id}`)
        .update(updateData);
      
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  /**
   * Delete expense for the currently logged-in user
   */
  deleteExpense: async (id) => {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      await firebaseDatabase.ref(`expenses/${user.uid}/${id}`).remove();
      return id;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  /**
   * Listen to real-time expense updates for the currently logged-in user
   */
  subscribeToExpenses: (callback) => {
    const user = firebaseAuth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return () => {};
    }

    const ref = firebaseDatabase.ref(`expenses/${user.uid}`);
    const listener = ref.on('value', snapshot => {
      const data = snapshot.val() || {};
      const expenses = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      callback(expenses);
    });

    // Return unsubscribe function
    return () => ref.off('value', listener);
  },
};

export default budgetService;