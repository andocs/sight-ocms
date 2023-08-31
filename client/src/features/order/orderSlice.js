import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";

const initialState = {
	newOrder: null,
	orderUpdate: null,
	order: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Create order record
export const createOrder = createAsyncThunk(
	"order/createOrder",
	async ({ patientId, orderData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await orderService.createOrder({ patientId, orderData }, token);
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

// Get all order records
export const getOrderList = createAsyncThunk(
	"order/getOrderList",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await orderService.getOrderList(token);
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

// Get order record details
export const getOrderDetails = createAsyncThunk(
	"order/getOrderDetails",
	async (orderId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await orderService.getOrderDetails(orderId, token);
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

// Edit order record
export const editOrder = createAsyncThunk(
	"order/editOrder",
	async ({ orderId, orderData }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await orderService.editOrder({ orderId, orderData }, token);
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

// Delete order record
export const deleteOrder = createAsyncThunk(
	"order/deleteOrder",
	async (orderId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await orderService.deleteOrder(orderId, token);
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

const orderSlice = createSlice({
	name: "order",
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
			.addCase(createOrder.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newOrder = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newOrder = null;
			})
			.addCase(getOrderList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getOrderList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.order = action.payload;
			})
			.addCase(getOrderList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.order = null;
			})
			.addCase(getOrderDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getOrderDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.orderUpdate = action.payload;
			})
			.addCase(getOrderDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.orderUpdate = null;
			})
			.addCase(editOrder.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newOrder = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(editOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
				state.newOrder = null;
			})
			.addCase(deleteOrder.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.order = state.order.filter(
					(record) => record._id !== action.payload.id
				);
				state.isLoading = false;
				state.message = action.payload.message;
			})
			.addCase(deleteOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
			});
	},
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;
