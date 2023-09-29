import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
	user: user ? user : null,
	navPage: [],
	infoUpdate: null,
	newInfo: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: "",
};

//Register user
export const register = createAsyncThunk(
	"auth/register",
	async (user, thunkAPI) => {
		try {
			return await authService.register(user);
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

//Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
	try {
		return await authService.login(user);
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) ||
			error.message ||
			error.toString();
		return thunkAPI.rejectWithValue(message);
	}
});

//Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
	await authService.logout();
});

//Add personal info (patient)
export const addInfo = createAsyncThunk(
	"auth/addInfo",
	async (personalInfo, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await authService.addInfo(personalInfo, token);
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

//Get user details
export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user;
		return await authService.getUser(token);
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) ||
			error.message ||
			error.toString();
		return thunkAPI.rejectWithValue(message);
	}
});

//Update profile
export const updateProfile = createAsyncThunk(
	"auth/updateProfile",
	async (updateProfile, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await authService.updateProfile(updateProfile, token);
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

//Update password
export const changePassword = createAsyncThunk(
	"auth/changePassword",
	async (updateProfile, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await authService.changePassword(updateProfile, token);
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

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			(state.newInfo = null), (state.infoUpdate = null);
		},
		setNavPage: (state, action) => {
			state.navPage = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.user = null;
			})
			.addCase(login.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.user = null;
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
				state.navPage = null;
				state.infoUpdate = null;
			})
			.addCase(getUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.infoUpdate = action.payload;
			})
			.addCase(getUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.infoUpdate = null;
			})
			.addCase(addInfo.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addInfo.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newInfo = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(addInfo.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newInfo = null;
			})
			.addCase(updateProfile.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newInfo = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(updateProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newInfo = null;
			})
			.addCase(changePassword.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(changePassword.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newInfo = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(changePassword.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newInfo = null;
			});
	},
});

export const { reset, clear, setNavPage } = authSlice.actions;
export default authSlice.reducer;
