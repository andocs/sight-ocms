import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = "https://sight-api.vercel.app/api";

// Create maintenance request
const createRequest = async (requestData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/maintenance`;
	const res = await axios.post(url, requestData, config);
	return res.data;
};

// Get all maintenance requests
const getMaintenanceList = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/maintenance`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get pending maintenance requests
const getPendingRequests = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/pending`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get maintenance request details
const getRequestDetails = async (requestId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/maintenance/${requestId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Edit maintenance record
const editRequest = async ({ requestId, requestData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/maintenance/${requestId}`;
	const res = await axios.put(url, requestData, config);
	return res.data;
};

// Delete maintenance request
const deleteRequest = async (requestId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	console.log(requestId);
	const url = `${BASE_URL}/${getUserRole(token)}/maintenance/${requestId}`;
	const res = await axios.delete(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const maintenanceService = {
	createRequest,
	getMaintenanceList,
	getPendingRequests,
	getRequestDetails,
	editRequest,
	deleteRequest,
};

export default maintenanceService;
