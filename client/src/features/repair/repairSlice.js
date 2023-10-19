import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import repairService from "./repairService";

const initialState = {
	newRepair: null,
	repairUpdate: null,
	repair: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Create repair record
export const addRepairRequest = createAsyncThunk(
	"repair/addRepairRequest",
	async ({ patientId, requestData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await repairService.addRepairRequest(
				{ patientId, requestData },
				token
			);
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

// Get all pending repairs in the system
export const getPendingRepairs = createAsyncThunk(
	"repair/getPendingRepairs",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await repairService.getPendingRepairs(token);
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

// Get all repair records
export const getRepairList = createAsyncThunk(
	"repair/getRepairList",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await repairService.getRepairList(token);
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

// Get repair record details
export const getRepairDetails = createAsyncThunk(
	"repair/getRepairDetails",
	async (requestId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await repairService.getRepairDetails(requestId, token);
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

// Edit repair record
export const updateRepairRequest = createAsyncThunk(
	"repair/updateRepairRequest",
	async ({ requestId, requestData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await repairService.updateRepairRequest(
				{ requestId, requestData },
				token
			);
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

// Delete repair record
export const deleteRepairRequest = createAsyncThunk(
	"repair/deleteRepairRequest",
	async (requestId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await repairService.deleteRepairRequest(requestId, token);
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

const repairSlice = createSlice({
	name: "repair",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			state.newRepair = null;
			state.repairUpdate = null;
			state.repair = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addRepairRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addRepairRequest.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newRepair = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(addRepairRequest.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newRepair = null;
			})

			.addCase(getPendingRepairs.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getPendingRepairs.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.repair = action.payload;
			})
			.addCase(getPendingRepairs.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.repair = null;
			})
			.addCase(getRepairList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getRepairList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.repair = action.payload;
			})
			.addCase(getRepairList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.repair = null;
			})
			.addCase(getRepairDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getRepairDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.repairUpdate = action.payload;
			})
			.addCase(getRepairDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.repairUpdate = null;
			})
			.addCase(updateRepairRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateRepairRequest.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newRepair = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(updateRepairRequest.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
				state.newRepair = null;
			})
			.addCase(deleteRepairRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteRepairRequest.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.repair = state.repair.filter(
					(record) => record._id !== action.payload.id
				);
				state.isLoading = false;
				state.message = action.payload.message;
			})
			.addCase(deleteRepairRequest.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
			});
	},
});

export const { reset, clear } = repairSlice.actions;
export default repairSlice.reducer;
