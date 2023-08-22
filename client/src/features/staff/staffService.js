import axios from "axios";
const BASE_URL = "http://localhost:5001/api/admin";

// Create staff account
const createStaffAccount = async (staffData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.post(`${BASE_URL}/staff`, staffData, config);
	return res.data;
};

// Get all staff accounts
const getStaffAccounts = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(`${BASE_URL}/staff`, config);
	return res.data;
};

// Get staff details
const getStaffDetails = async (staffId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(`${BASE_URL}/staff/${staffId}`, config);
	return res.data;
};

// Edit staff account
const editStaffAccount = async ({ staffId, staffData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.put(
		`${BASE_URL}/staff/${staffId}`,
		staffData,
		config
	);
	return res.data;
};

// Delete staff account
const deleteStaffAccount = async (staffId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.delete(`${BASE_URL}/staff/${staffId}`, config);
	return res.data;
};

const staffService = {
	createStaffAccount,
	getStaffAccounts,
	getStaffDetails,
	editStaffAccount,
	deleteStaffAccount,
};

export default staffService;
