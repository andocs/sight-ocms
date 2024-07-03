import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = "https://sight-lyart.vercel.app/api";

// Create order record
const createOrder = async ({ patientId, orderData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/order/${patientId}`;
	const res = await axios.post(url, orderData, config);
	return res.data;
};

// Get all pending orders in the system
const getPendingOrders = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/order`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get all technician's previous orders
const getOrderHistory = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/order-history`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get all order records
const getOrderList = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/order`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get order record details
const getOrderDetails = async (orderId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/order/${orderId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Edit order record
const editOrder = async ({ orderId, orderData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/order/${orderId}`;
	const res = await axios.put(url, orderData, config);
	return res.data;
};

// Delete order record
const deleteOrder = async (orderId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/order/${orderId}`;
	const res = await axios.delete(url, config);
	return res.data;
};

const getInventory = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/inventory`;
	const res = await axios.get(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const orderService = {
	createOrder,
	getPendingOrders,
	getOrderHistory,
	getOrderList,
	getOrderDetails,
	editOrder,
	deleteOrder,
	getInventory,
};

export default orderService;
