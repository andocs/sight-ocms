import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = "http://localhost:5001/api";

// Create repair record
const addRepairRequest = async ({ patientId, requestData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/repair/${patientId}`;
	const res = await axios.post(url, requestData, config);
	return res.data;
};

// Get all pending repairs in the system
const getPendingRepairs = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/pending/repair`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get all repair records
const getRepairList = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/repair`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get repair record details
const getRepairDetails = async (requestId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/repair/${requestId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Edit repair record
const updateRepairRequest = async ({ requestId, requestData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/repair/${requestId}`;
	const res = await axios.put(url, requestData, config);
	return res.data;
};

// Delete repair record
const deleteRepairRequest = async (requestId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/repair/${requestId}`;
	const res = await axios.delete(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const repairService = {
	addRepairRequest,
	getPendingRepairs,
	getRepairList,
	getRepairDetails,
	updateRepairRequest,
	deleteRepairRequest,
};

export default repairService;
