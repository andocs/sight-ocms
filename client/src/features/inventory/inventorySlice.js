import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryService from "./inventoryService";

const initialState = {
	newItem: null,
	itemUpdate: null,
	item: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

// Add new item
export const addNewItem = createAsyncThunk(
	"inventory/addNewItem",
	async (itemDetails, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await inventoryService.addNewItem(itemDetails, token);
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

// Get all inventory items
export const getInventoryItems = createAsyncThunk(
	"inventory/getInventoryItems",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await inventoryService.getInventoryItems(token);
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

// Get all staff accounts
export const getItemDetails = createAsyncThunk(
	"inventory/getItemDetails",
	async (itemId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			const itemDetails = await inventoryService.getItemDetails(itemId, token);
			console.log(itemDetails);
			return itemDetails;
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

// Edit staff account
export const editInventoryDetails = createAsyncThunk(
	"inventory/editInventoryDetails",
	async ({ itemId, itemDetails }, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await inventoryService.editInventoryDetails(
				{ itemId, itemDetails },
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

// Delete staff account
export const deleteInventoryItem = createAsyncThunk(
	"inventory/deleteInventoryItem",
	async (itemId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user;
			return await inventoryService.deleteInventoryItem(itemId, token);
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

const inventorySlice = createSlice({
	name: "inventory",
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		clear: (state) => {
			(state.newItem = null), (state.itemUpdate = null), (state.item = []);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addNewItem.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addNewItem.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newItem = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(addNewItem.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.newItem = null;
			})
			.addCase(getInventoryItems.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getInventoryItems.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.item = action.payload;
			})
			.addCase(getInventoryItems.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.item = null;
			})
			.addCase(getItemDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getItemDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.itemUpdate = action.payload;
			})
			.addCase(getItemDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.itemUpdate = null;
			})
			.addCase(editInventoryDetails.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editInventoryDetails.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.newItem = action.payload.data;
				state.message = action.payload.message;
			})
			.addCase(editInventoryDetails.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
				state.newItem = null;
			})
			.addCase(deleteInventoryItem.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteInventoryItem.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.item = state.item.filter(
					(piece) => piece._id !== action.payload.id
				);
				state.isLoading = false;
				state.isSuccess = true;
				state.message = action.payload.message;
			})
			.addCase(deleteInventoryItem.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.isSuccess = false;
				state.message = action.payload;
			});
	},
});

export const { reset, clear } = inventorySlice.actions;
export default inventorySlice.reducer;
