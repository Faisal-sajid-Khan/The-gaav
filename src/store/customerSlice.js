import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  customerAccessTokenCreate, 
  customerCreate, 
  getCustomerData,
  customerUpdate
} from '../lib/shopify';

// Thunks
export const loginCustomer = createAsyncThunk(
  'customer/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await customerAccessTokenCreate(email, password);
      if (response.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
        return rejectWithValue(response.data.customerAccessTokenCreate.customerUserErrors[0].message);
      }
      
      const token = response.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
      if (!token) throw new Error('Failed to retrieve access token');
      
      // Store token in local storage
      localStorage.setItem('customerAccessToken', token);
      return token;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerCustomer = createAsyncThunk(
  'customer/register',
  async ({ firstName, lastName, email, password }, { rejectWithValue }) => {
    try {
      const response = await customerCreate(firstName, lastName, email, password);
      if (response.data?.customerCreate?.customerUserErrors?.length > 0) {
        return rejectWithValue(response.data.customerCreate.customerUserErrors[0].message);
      }
      // Registration successful
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomerDetails = createAsyncThunk(
  'customer/fetchDetails',
  async (token, { rejectWithValue }) => {
    try {
      const response = await getCustomerData(token);
      if (response.errors) {
        return rejectWithValue(response.errors[0].message);
      }
      return response.data?.customer;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomerDetails = createAsyncThunk(
  'customer/updateDetails',
  async ({ token, customer }, { rejectWithValue }) => {
    try {
      const response = await customerUpdate(token, customer);
      if (response.data?.customerUpdate?.customerUserErrors?.length > 0) {
        return rejectWithValue(response.data.customerUpdate.customerUserErrors[0].message);
      }
      return response.data?.customerUpdate?.customer;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  accessToken: localStorage.getItem('customerAccessToken') || null,
  customerData: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.customerData = null;
      state.error = null;
      localStorage.removeItem('customerAccessToken');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Data
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.customerData = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Token might be expired/invalid, clear it out
        state.accessToken = null;
        localStorage.removeItem('customerAccessToken');
      })
      // Update Details
      .addCase(updateCustomerDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.customerData = { ...state.customerData, ...action.payload };
      })
      .addCase(updateCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = customerSlice.actions;
export default customerSlice.reducer;
