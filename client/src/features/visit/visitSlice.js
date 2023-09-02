import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import visitService from "./visitService";

const initialState = {
	newVisit: null,
	visitUpdate: null,
	visit: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Create visit record
export const createVisitRecord = createAsyncThunk(
	"visit/createVisitRecord",
	async ({ patientId, visitData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await visitService.createVisitRecord(
				{ patientId, visitData },
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

// Get all visit records
export const getVisitList = createAsyncThunk(
	"visit/getVisitList",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await visitService.getVisitList(token);
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

// Get visit record details
export const getVisitDetails = createAsyncThunk(
	"visit/getVisitDetails",
	async (visitId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await visitService.getVisitDetails(visitId, token);
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

// Edit visit record
export const editVisitRecord = createAsyncThunk(
	"visit/editVisitRecord",
	async ({ visitId, visitData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await visitService.editVisitRecord({ visitId, visitData }, token);
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

// Delete visit record
export const deleteVisitRecord = createAsyncThunk(
	"visit/deleteVisitRecord",
	async (visitId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await visitService.deleteVisitRecord(visitId, token);
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

const visitSlice = createSlice({
	name: "visit",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			state.newVisit = null;
			state.visitUpdate = null;
			state.visit = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createVisitRecord.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createVisitRecord.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newVisit = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(createVisitRecord.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newVisit = null;
			})
			.addCase(getVisitList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getVisitList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.visit = action.payload;
			})
			.addCase(getVisitList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.visit = null;
			})
			.addCase(getVisitDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getVisitDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.visitUpdate = action.payload;
			})
			.addCase(getVisitDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.visitUpdate = null;
			})
			.addCase(editVisitRecord.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editVisitRecord.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newVisit = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(editVisitRecord.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
				state.newVisit = null;
			})
			.addCase(deleteVisitRecord.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteVisitRecord.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.visit = state.visit.filter(
					(record) => record._id !== action.payload.id
				);
				state.isLoading = false;
				state.message = action.payload.message;
			})
			.addCase(deleteVisitRecord.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
			});
	},
});

export const { reset, clear } = visitSlice.actions;
export default visitSlice.reducer;
