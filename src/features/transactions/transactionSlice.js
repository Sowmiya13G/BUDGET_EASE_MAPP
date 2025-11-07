 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import database from '@react-native-firebase/database';

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async ({ userId, data }, thunkAPI) => {
    try {
      const newRef = database().ref(`/transactions/${userId}`).push();
      await newRef.set(data);
      return { id: newRef.key, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (userId, thunkAPI) => {
    try {
      const snapshot = await database()
        .ref(`/transactions/${userId}`)
        .once('value');
      const val = snapshot.val() || {};
      return Object.entries(val).map(([id, tx]) => ({ id, ...tx }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default transactionSlice.reducer;
