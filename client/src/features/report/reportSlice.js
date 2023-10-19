import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "./reportService";

const initialState = {
	report: [],
	weeklyTech: [],
	weeklyDoc: [],
	monthlyTech: [],
	monthlyDoc: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Generate weekly technician report
export const getWeeklyTech = createAsyncThunk(
	"report/getWeeklyTech",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getWeeklyTech(token);
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

// Generate monthly technician report
export const getMonthlyTech = createAsyncThunk(
	"report/getMonthlyTech",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getMonthlyTech(token);
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

// Generate weekly doctor report
export const getWeeklyDoc = createAsyncThunk(
	"report/getWeeklyDoc",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getWeeklyDoc(token);
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

// Generate monthly doctor report
export const getMonthlyDoc = createAsyncThunk(
	"report/getMonthlyDoc",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getMonthlyDoc(token);
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

const reportSlice = createSlice({
	name: "report",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			state.report = [];
			state.weeklyTech = [];
			state.weeklyDoc = [];
			state.monthlyTech = [];
			state.monthlyDoc = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getWeeklyTech.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getWeeklyTech.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.weeklyTech = action.payload;
			})
			.addCase(getWeeklyTech.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.weeklyTech = null;
			})
			.addCase(getMonthlyTech.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMonthlyTech.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.monthlyTech = action.payload;
			})
			.addCase(getMonthlyTech.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.monthlyTech = null;
			})
			.addCase(getWeeklyDoc.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getWeeklyDoc.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.weeklyDoc = action.payload;
			})
			.addCase(getWeeklyDoc.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.weeklyDoc = null;
			})
			.addCase(getMonthlyDoc.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMonthlyDoc.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.monthlyDoc = action.payload;
			})
			.addCase(getMonthlyDoc.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.monthlyDoc = null;
			});
	},
});

export const { reset, clear } = reportSlice.actions;
export default reportSlice.reducer;
