import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {googleSignIn, loginUser, logoutUser, registerUser} from './authService';

// Register User

export const handleRegister = createAsyncThunk(
  'auth/register',

  async ({email, password}, thunkAPI) => {
    try {
      const user = await registerUser(email, password);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Login User

export const handleLogin = createAsyncThunk(
  'auth/login',

  async ({email, password}, thunkAPI) => {
    try {
      const user = await loginUser(email, password);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Google Sign-In

export const handleGoogleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, thunkAPI) => {
    try {
      const user = await googleSignIn();
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Logout User
export const handleLogout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await logoutUser();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearError: state => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      // Register Cases
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

      // Login Cases
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

      // Google Login Cases
      .addCase(handleGoogleLogin.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(handleGoogleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(handleGoogleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout Cases
      .addCase(handleLogout.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(handleLogout.fulfilled, state => {
        state.loading = false;
        state.user = null;
      })

      .addCase(handleLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearError, setUser} = authSlice.actions;

export default authSlice.reducer;
