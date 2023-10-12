import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import patientService from "./patientService";

const initialState = {
	newPatient: null,
	patientUpdate: null,
	patient: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Create patient record
export const createPatientRecord = createAsyncThunk(
	"patient/createPatientRecord",
	async (patientData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await patientService.createPatientRecord(patientData, token);
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

// Get all patient records
export const getPatientList = createAsyncThunk(
	"patient/getPatientList",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			const patientArray = await patientService.getPatientList(token);
			const patientData = Object.keys(patientArray).map((key) => ({
				...patientArray[key].personalInfo,
				_id: patientArray[key]._id,
				email: patientArray[key].email,
				role: patientArray[key].role,
				createdAt: patientArray[key].createdAt,
				updatedAt: patientArray[key].updatedAt,
				image: patientArray[key].image,
			}));
			return patientData;
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

// Get patient record details
export const getPatientDetails = createAsyncThunk(
	"patient/getPatientDetails",
	async (patientId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await patientService.getPatientDetails(patientId, token);
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

// Get patient history
export const getPatientHistory = createAsyncThunk(
	"patient/getPatientHistory",
	async (patientId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await patientService.getPatientHistory(patientId, token);
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

const patientSlice = createSlice({
	name: "patient",
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
			.addCase(createPatientRecord.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createPatientRecord.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newPatient = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(createPatientRecord.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newPatient = null;
			})
			.addCase(getPatientList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getPatientList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.patient = action.payload;
			})
			.addCase(getPatientList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.patient = null;
			})
			.addCase(getPatientDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getPatientDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.patientUpdate = action.payload;
			})
			.addCase(getPatientDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.patientUpdate = null;
			})
			.addCase(getPatientHistory.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getPatientHistory.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.patient = action.payload;
			})
			.addCase(getPatientHistory.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.patient = null;
			});
	},
});

export const { reset } = patientSlice.actions;
export default patientSlice.reducer;
