import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appointmentService from "./appointmentService";

const initialState = {
	newAppointment: null,
	appointmentUpdate: null,
	appointment: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Create appointment record
export const createAppointment = createAsyncThunk(
	"appointment/createAppointment",
	async ({ patientId, appointmentData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await appointmentService.createAppointment(
				{ patientId, appointmentData },
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

// Schedule appointment
export const scheduleAppointment = createAsyncThunk(
	"appointment/scheduleAppointment",
	async (appointmentData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await appointmentService.scheduleAppointment(
				appointmentData,
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

// Get all appointment records
export const getAppointmentList = createAsyncThunk(
	"appointment/getAppointmentList",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await appointmentService.getAppointmentList(token);
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

// Get all appointment records
export const getPendingAppointments = createAsyncThunk(
	"appointment/getPendingAppointments",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await appointmentService.getPendingAppointments(token);
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

// Get appointment details
export const getAppointmentDetails = createAsyncThunk(
	"appointment/getAppointmentDetails",
	async (appointmentId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await appointmentService.getAppointmentDetails(
				appointmentId,
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

// Edit appointment record
export const editAppointment = createAsyncThunk(
	"appointment/editAppointment",
	async ({ appointmentId, appointmentData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await appointmentService.editAppointment(
				{ appointmentId, appointmentData },
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

// Delete appointment record
export const deleteAppointment = createAsyncThunk(
	"appointment/deleteAppointment",
	async (appointmentId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await appointmentService.deleteAppointment(appointmentId, token);
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

const appointmentSlice = createSlice({
	name: "appointment",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			state.newAppointment = null;
			state.appointmentUpdate = null;
			state.appointment = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createAppointment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createAppointment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newAppointment = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(createAppointment.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newAppointment = null;
			})
			.addCase(scheduleAppointment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(scheduleAppointment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newAppointment = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(scheduleAppointment.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newAppointment = null;
			})
			.addCase(getAppointmentList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAppointmentList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.appointment = action.payload;
			})
			.addCase(getAppointmentList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.appointment = null;
			})
			.addCase(getPendingAppointments.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getPendingAppointments.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.appointment = action.payload;
			})
			.addCase(getPendingAppointments.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.appointment = null;
			})
			.addCase(getAppointmentDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAppointmentDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.appointmentUpdate = action.payload;
			})
			.addCase(getAppointmentDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.appointmentUpdate = null;
			})
			.addCase(editAppointment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editAppointment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newAppointment = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(editAppointment.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
				state.newAppointment = null;
			})
			.addCase(deleteAppointment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteAppointment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.appointment = state.appointment.filter(
					(record) => record._id !== action.payload.id
				);
				state.isLoading = false;
				state.message = action.payload.message;
			})
			.addCase(deleteAppointment.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
			});
	},
});

export const { reset, clear } = appointmentSlice.actions;
export default appointmentSlice.reducer;
