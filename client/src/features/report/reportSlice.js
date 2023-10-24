import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "./reportService";

const initialState = {
	weeklyTech: [],
	weeklyDoc: [],
	monthlyTech: [],
	monthlyDoc: [],

	inventory: [],
	weeklyOrder: [],
	monthlyOrder: [],
	batches: [],
	monthlySales: [],
	quarterlySales: [],

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

// Generate monthly doctor report
export const getInventoryReport = createAsyncThunk(
	"report/getInventoryReport",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getInventoryReport(token);
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
export const getWeeklyOrd = createAsyncThunk(
	"report/getWeeklyOrd",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getWeeklyOrd(token);
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
export const getMonthlyOrd = createAsyncThunk(
	"report/getMonthlyOrd",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getMonthlyOrd(token);
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
export const getBatches = createAsyncThunk(
	"report/getBatches",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getBatches(token);
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
export const getQuarterlySales = createAsyncThunk(
	"report/getQuarterlySales",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getQuarterlySales(token);
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
export const getMonthlySales = createAsyncThunk(
	"report/getMonthlySales",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await reportService.getMonthlySales(token);
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
			state.weeklyTech = [];
			state.weeklyDoc = [];
			state.monthlyTech = [];
			state.monthlyDoc = [];
			state.inventory = [];
			state.weeklyOrder = [];
			state.monthlyOrder = [];
			state.batches = [];
			state.weeklySales = [];
			state.monthlySales = [];
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
			})
			.addCase(getInventoryReport.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getInventoryReport.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.inventory = action.payload;
			})
			.addCase(getInventoryReport.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.inventory = null;
			})
			.addCase(getWeeklyOrd.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getWeeklyOrd.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.weeklyOrder = action.payload;
			})
			.addCase(getWeeklyOrd.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.weeklyOrder = null;
			})
			.addCase(getMonthlyOrd.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMonthlyOrd.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.monthlyOrder = action.payload;
			})
			.addCase(getMonthlyOrd.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.monthlyOrder = null;
			})
			.addCase(getBatches.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getBatches.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.batches = action.payload;
			})
			.addCase(getBatches.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.batches = null;
			})

			.addCase(getMonthlySales.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMonthlySales.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.monthlySales = action.payload;
			})
			.addCase(getMonthlySales.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.monthlySales = null;
			})
			.addCase(getQuarterlySales.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getQuarterlySales.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.quarterlySales = action.payload;
			})
			.addCase(getQuarterlySales.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.quarterlySales = null;
			});
	},
});

export const { reset, clear } = reportSlice.actions;
export default reportSlice.reducer;
