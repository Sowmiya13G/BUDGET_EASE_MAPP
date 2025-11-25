import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import budgetReducer from '../features/budget/budgetSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    budget: budgetReducer,
  },
});

export default store;
