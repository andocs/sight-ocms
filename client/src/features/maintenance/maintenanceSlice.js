import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import maintenanceService from "./maintenanceService";

const initialState = {
	newMaintenance: null,
	maintenanceUpdate: null,
	maintenance: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Create maintenance request
export const createRequest = createAsyncThunk(
	"maintenance/createRequest",
	async (requestData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await maintenanceService.createRequest(requestData, token);
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

// Get all maintenance requests
export const getMaintenanceList = createAsyncThunk(
	"maintenance/getMaintenanceList",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await maintenanceService.getMaintenanceList(token);
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

// Get all maintenance requests
export const getPendingRequests = createAsyncThunk(
	"maintenance/getPendingRequests",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await maintenanceService.getPendingRequests(token);
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

// Get maintenance request details
export const getRequestDetails = createAsyncThunk(
	"maintenance/getRequestDetails",
	async (requestId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await maintenanceService.getRequestDetails(requestId, token);
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

// Edit maintenance record
export const editRequest = createAsyncThunk(
	"maintenance/editRequest",
	async ({ requestId, requestData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await maintenanceService.editRequest(
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

// Delete maintenance record
export const deleteRequest = createAsyncThunk(
	"maintenance/deleteRequest",
	async (requestId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await maintenanceService.deleteRequest(requestId, token);
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

const maintenanceSlice = createSlice({
	name: "maintenance",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			state.newMaintenance = null;
			state.maintenanceUpdate = null;
			state.maintenance = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createRequest.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newMaintenance = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(createRequest.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newMaintenance = null;
			})
			.addCase(getMaintenanceList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMaintenanceList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.maintenance = action.payload;
			})
			.addCase(getMaintenanceList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.maintenance = null;
			})
			.addCase(getPendingRequests.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getPendingRequests.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.maintenance = action.payload;
			})
			.addCase(getPendingRequests.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.maintenance = null;
			})
			.addCase(getRequestDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getRequestDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.maintenanceUpdate = action.payload;
			})
			.addCase(getRequestDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.maintenanceUpdate = null;
			})
			.addCase(editRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editRequest.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newMaintenance = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(editRequest.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
				state.newMaintenance = null;
			})
			.addCase(deleteRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteRequest.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.maintenance = state.maintenance.filter(
					(record) => record._id !== action.payload.id
				);
				state.isLoading = false;
				state.message = action.payload.message;
			})
			.addCase(deleteRequest.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
			});
	},
});

export const { reset, clear } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
