// store/budgetSlice.js
import auth from '@react-native-firebase/auth';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import budgetService from './budgetService';

// Add expense
export const addExpense = createAsyncThunk(
  'budget/addExpense',
  async ({ expense }, { rejectWithValue }) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('User not logged in');
      const newExpense = await budgetService.addExpense({
        ...expense,
        userId: user.uid,
      });
      return newExpense;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch all expenses
export const fetchExpenses = createAsyncThunk(
  'budget/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const expenses = await budgetService.getExpenses();
      return expenses;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState: { expenses: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addExpense.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchExpenses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default budgetSlice.reducer;
