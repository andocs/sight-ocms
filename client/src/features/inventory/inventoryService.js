import axios from "axios";
const BASE_URL = "http://localhost:5001/api/admin";

// Add new item
const addNewItem = async (itemDetails, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.post(`${BASE_URL}/inventory`, itemDetails, config);
	return res.data;
};

// Get all inventory items
const getInventoryItems = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(`${BASE_URL}/inventory`, config);
	return res.data;
};

// Get item details
const getItemDetails = async (itemId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(`${BASE_URL}/inventory/${itemId}`, config);
	return res.data;
};

// Edit item details
const editInventoryDetails = async ({ itemId, itemDetails }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.put(
		`${BASE_URL}/inventory/${itemId}`,
		itemDetails,
		config
	);
	return res.data;
};

// Delete inventory item
const deleteInventoryItem = async (itemId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.delete(`${BASE_URL}/inventory/${itemId}`, config);
	return res.data;
};

const inventoryService = {
	addNewItem,
	getInventoryItems,
	getItemDetails,
	editInventoryDetails,
	deleteInventoryItem,
};

export default inventoryService;
