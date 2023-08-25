import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import auditService from "./auditService";

const initialState = {
	audit: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Get all audit logs
export const getAuditLogs = createAsyncThunk(
	"audit/getAuditLogs",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			const logData = await auditService.getAuditLogs(token);
			return logData;
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

// Get audit log details
export const getLogDetails = createAsyncThunk(
	"audit/getLogDetails",
	async (logId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			const logData = await auditService.getLogDetails(logId, token);
			return logData;
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

const auditSlice = createSlice({
	name: "audit",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAuditLogs.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAuditLogs.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.audit = action.payload;
			})
			.addCase(getAuditLogs.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.audit = null;
			})
			.addCase(getLogDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getLogDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.audit = action.payload;
			})
			.addCase(getLogDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.audit = null;
			});
	},
});

export const { reset } = auditSlice.actions;
export default auditSlice.reducer;
