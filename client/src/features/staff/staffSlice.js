import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import staffService from './staffService';

const initialState = {
  newStaff: null,
  staff: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

// Create staff account
export const createStaffAccount = createAsyncThunk(
  'staff/createStaffAccount',
  async (staffData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await staffService.createStaffAccount(staffData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all staff accounts
export const getStaffAccounts = createAsyncThunk(
  'staff/getStaffAccount', async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const staffArray = await staffService.getStaffAccounts(token);
      const staffData = Object.keys(staffArray).map(key => ({
        ...staffArray[key].personalInfo,
        _id: staffArray[key]._id,
        email: staffArray[key].email,
        role: staffArray[key].role,
        createdAt: staffArray[key].createdAt,
        updatedAt: staffArray[key].updatedAt,
      }));
      return staffData
    }
    catch (error){
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
  
);

// Edit staff account
export const editStaffAccount = createAsyncThunk(
  'staff/editStaffAccount',
  async (staffData, thunkAPI) => {
    try {
      return await staffService.editStaffAccount(staffData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete staff account
export const deleteStaffAccount = createAsyncThunk(
  'staff/deleteStaffAccount',
  async (staffId, thunkAPI) => {
    try {
      await staffService.deleteStaffAccount(staffId);
      return staffId; // Return the deleted staff account ID
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStaffAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStaffAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.newStaff = action.payload;
      })
      .addCase(createStaffAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.newStaff = null;
      })
      .addCase(getStaffAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStaffAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.staff = action.payload;
      })
      .addCase(getStaffAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.staff = null;
      })
      .addCase(editStaffAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editStaffAccount.fulfilled, (state, action) => {
        const updatedAccount = action.payload;
        const index = state.accounts.findIndex(
          (account) => account.id === updatedAccount.id
        );
        if (index !== -1) {
          state.accounts[index] = updatedAccount;
        }
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(editStaffAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(deleteStaffAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStaffAccount.fulfilled, (state, action) => {
        const deletedAccountId = action.payload;
        state.accounts = state.accounts.filter(
          (account) => account.id !== deletedAccountId
        );
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteStaffAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { reset } = staffSlice.actions;
export default staffSlice.reducer;
