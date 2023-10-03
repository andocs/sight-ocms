import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "./reportService";

const initialState = {
	report: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Generate weekly staff report
export const getWeeklyStaff = createAsyncThunk(
	"report/getWeeklyStaff",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getWeeklyStaff(token);
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

// Generate monthly staff report
export const getMonthlyStaff = createAsyncThunk(
	"report/getMonthlyStaff",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getMonthlyStaff(token);
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
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getWeeklyStaff.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getWeeklyStaff.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.report = action.payload;
			})
			.addCase(getWeeklyStaff.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.report = null;
			})
			.addCase(getMonthlyStaff.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMonthlyStaff.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.report = action.payload;
			})
			.addCase(getMonthlyStaff.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.report = null;
			});
	},
});

export const { reset, clear } = reportSlice.actions;
export default reportSlice.reducer;
