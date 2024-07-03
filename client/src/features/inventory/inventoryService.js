import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = process.env.BASE_URL +="api";

// Add new item
const addNewItem = async (itemDetails, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/inventory`;
	const res = await axios.post(url, itemDetails, config);
	return res.data;
};

// Get all inventory items
const getInventoryItems = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/inventory`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get item details
const getItemDetails = async (itemId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/inventory/${itemId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Edit item details
const editInventoryDetails = async ({ itemId, itemDetails }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/inventory/${itemId}`;
	const res = await axios.put(url, itemDetails, config);
	return res.data;
};

// Restock Item
const restockItem = async ({ itemId, itemDetails }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/restock/${itemId}`;
	const res = await axios.put(url, itemDetails, config);
	return res.data;
};

// Delete inventory item
const deleteInventoryItem = async (itemId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/inventory/${itemId}`;
	const res = await axios.delete(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const inventoryService = {
	addNewItem,
	getInventoryItems,
	getItemDetails,
	editInventoryDetails,
	restockItem,
	deleteInventoryItem,
};

export default inventoryService;
