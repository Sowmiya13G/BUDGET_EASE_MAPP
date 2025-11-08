import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {loginUser, registerUser, logoutUser} from '../../services/authService';

export const handleRegister = createAsyncThunk('auth/register', async ({email, password}, thunkAPI) => {
  try {
    const user = await registerUser(email, password);
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const handleLogin = createAsyncThunk('auth/login', async ({email, password}, thunkAPI) => {
  try {
    const user = await loginUser(email, password);
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const handleLogout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await logoutUser();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(handleRegister.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(handleRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(handleLogin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(handleLogout.fulfilled, state => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
