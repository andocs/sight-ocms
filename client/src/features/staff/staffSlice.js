import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import staffService from "./staffService";

const initialState = {
	newStaff: null,
	staffUpdate: null,
	staff: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Create staff account
export const createStaffAccount = createAsyncThunk(
	"staff/createStaffAccount",
	async (staffData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
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
	"staff/getStaffAccount",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			const staffArray = await staffService.getStaffAccounts(token);
			const staffData = Object.keys(staffArray).map((key) => ({
				...staffArray[key].personalInfo,
				_id: staffArray[key]._id,
				email: staffArray[key].email,
				role: staffArray[key].role,
				createdAt: staffArray[key].createdAt,
				updatedAt: staffArray[key].updatedAt,
				image: staffArray[key].image,
			}));
			return staffData;
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

// Get staff details
export const getStaffDetails = createAsyncThunk(
	"staff/getStaffDetails",
	async (staffId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			const staffData = await staffService.getStaffDetails(staffId, token);
			return staffData;
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

// Edit staff account
export const editStaffAccount = createAsyncThunk(
	"staff/editStaffAccount",
	async ({ staffId, staffData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await staffService.editStaffAccount({ staffId, staffData }, token);
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
	"staff/deleteStaffAccount",
	async (staffId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await staffService.deleteStaffAccount(staffId, token);
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
	name: "staff",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			(state.newStaff = null), (state.staffUpdate = null), (state.staff = []);
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
				state.newStaff = action.payload.data;
				state.message = action.payload.message;
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
			.addCase(getStaffDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getStaffDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.staffUpdate = action.payload;
			})
			.addCase(getStaffDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.staffUpdate = null;
			})
			.addCase(editStaffAccount.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editStaffAccount.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newStaff = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(editStaffAccount.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
				state.newStaff = null;
			})
			.addCase(deleteStaffAccount.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteStaffAccount.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.staff = state.staff.filter(
					(account) => account._id !== action.payload.id
				);
				state.isLoading = false;
				state.message = action.payload.message;
			})
			.addCase(deleteStaffAccount.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
			});
	},
});

export const { reset, clear } = staffSlice.actions;
export default staffSlice.reducer;
