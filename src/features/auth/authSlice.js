import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  googleSignInService,
  loginUser,
  logoutUser,
  registerUser,
  setPasswordForGoogleUser,
} from './authService';

// Email/Password login
export const handleLogin = createAsyncThunk(
  'auth/login',
  async ({email, password}, thunkAPI) => {
    try {
      return await loginUser(email, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || 'Login Failed');
    }
  },
);

// Register user
export const handleRegister = createAsyncThunk(
  'auth/register',
  async ({email, password}, thunkAPI) => {
    try {
      return await registerUser(email, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || 'Registration Failed');
    }
  },
);

// Google login
export const handleGoogleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, thunkAPI) => {
    try {
      return await googleSignInService();
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || 'Google Login Failed');
    }
  },
);

// Logout
export const handleLogout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await logoutUser();
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || 'Logout Failed');
    }
  },
);

// Set password for Google user
export const handleSetPassword = createAsyncThunk(
  'auth/setPassword',
  async ({password}, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      if (!user) throw new Error('No logged in user');
      await setPasswordForGoogleUser(user, password);
      return {message: 'Password set successfully'};
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || 'Failed to set password',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {user: null, loading: false, error: null},
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

      .addCase(handleSetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSetPassword.fulfilled, state => {
        state.loading = false;
      })
      .addCase(handleSetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearError, setUser} = authSlice.actions;
export default authSlice.reducer;
