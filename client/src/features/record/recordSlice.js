import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import recordService from "./recordService";

const initialState = {
	newRecord: null,
	recordUpdate: null,
	record: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Create new record
export const createEyeRecord = createAsyncThunk(
	"record/createEyeRecord",
	async ({ patientId, recordData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await recordService.createEyeRecord(
				{ patientId, recordData },
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

// Get all eye record
export const getEyeRecords = createAsyncThunk(
	"record/getEyeRecords",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await recordService.getEyeRecords(token);
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

// Get record details
export const getRecordDetails = createAsyncThunk(
	"record/getRecordDetails",
	async (recordId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await recordService.getRecordDetails(recordId, token);
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

// Edit eye record
export const editEyeRecord = createAsyncThunk(
	"record/editEyeRecord",
	async ({ recordId, recordData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await recordService.editEyeRecord({ recordId, recordData }, token);
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

// Delete eye record
export const deleteEyeRecord = createAsyncThunk(
	"record/deleteEyeRecord",
	async (recordId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await recordService.deleteEyeRecord(recordId, token);
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

const recordSlice = createSlice({
	name: "record",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			state.newRecord = null;
			state.recordUpdate = null;
			state.record = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createEyeRecord.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createEyeRecord.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newRecord = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(createEyeRecord.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newRecord = null;
			})
			.addCase(getEyeRecords.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getEyeRecords.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.record = action.payload;
			})
			.addCase(getEyeRecords.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.record = null;
			})
			.addCase(getRecordDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getRecordDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.recordUpdate = action.payload;
			})
			.addCase(getRecordDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.recordUpdate = null;
			})
			.addCase(editEyeRecord.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editEyeRecord.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newRecord = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(editEyeRecord.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
				state.newRecord = null;
			})
			.addCase(deleteEyeRecord.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteEyeRecord.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.record = state.record.filter(
					(record) => record._id !== action.payload.id
				);
				state.isLoading = false;
				state.message = action.payload.message;
			})
			.addCase(deleteEyeRecord.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
			});
	},
});

export const { reset, clear } = recordSlice.actions;
export default recordSlice.reducer;
