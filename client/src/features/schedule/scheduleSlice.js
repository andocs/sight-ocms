import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import scheduleService from "./scheduleService";

const initialState = {
	availableDays: null,
	newSchedule: null,
	scheduleUpdate: null,
	schedule: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Create schedule record
export const createSchedule = createAsyncThunk(
	"schedule/createSchedule",
	async (scheduleData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await scheduleService.createSchedule(scheduleData, token);
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

// Get all schedule records
export const getScheduleList = createAsyncThunk(
	"schedule/getScheduleList",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await scheduleService.getScheduleList(token);
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

// Get available days
export const getAvailableDays = createAsyncThunk(
	"schedule/getAvailableDays",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await scheduleService.getAvailableDays(token);
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

// Get schedule record details
export const getScheduleDetails = createAsyncThunk(
	"schedule/getScheduleDetails",
	async (scheduleId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await scheduleService.getScheduleDetails(scheduleId, token);
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

// Edit schedule record
export const editSchedule = createAsyncThunk(
	"schedule/editSchedule",
	async ({ scheduleId, scheduleData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await scheduleService.editSchedule(
				{ scheduleId, scheduleData },
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

// Delete schedule record
export const deleteSchedule = createAsyncThunk(
	"schedule/deleteSchedule",
	async (scheduleId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await scheduleService.deleteSchedule(scheduleId, token);
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

const scheduleSlice = createSlice({
	name: "schedule",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			state.newSchedule = null;
			state.scheduleUpdate = null;
			state.schedule = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createSchedule.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createSchedule.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newSchedule = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(createSchedule.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newSchedule = null;
			})
			.addCase(getScheduleList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getScheduleList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.schedule = action.payload;
			})
			.addCase(getScheduleList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.schedule = null;
			})
			.addCase(getAvailableDays.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAvailableDays.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.availableDays = action.payload;
			})
			.addCase(getAvailableDays.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.availableDays = null;
			})
			.addCase(getScheduleDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getScheduleDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.scheduleUpdate = action.payload;
			})
			.addCase(getScheduleDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.scheduleUpdate = null;
			})
			.addCase(editSchedule.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editSchedule.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newSchedule = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(editSchedule.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
				state.newSchedule = null;
			})
			.addCase(deleteSchedule.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteSchedule.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.schedule = state.schedule.filter(
					(record) => record._id !== action.payload.id
				);
				state.isLoading = false;
				state.message = action.payload.message;
			})
			.addCase(deleteSchedule.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
			});
	},
});

export const { reset, clear } = scheduleSlice.actions;
export default scheduleSlice.reducer;
