import axios from "axios";
const BASE_URL = "https://sight-lyart.vercel.app/api/admin/staff";

// Create staff account
const createStaffAccount = async (staffData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.post(`${BASE_URL}`, staffData, config);
	return res.data;
};

// Get all staff accounts
const getStaffAccounts = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(`${BASE_URL}`, config);
	return res.data;
};

// Get staff details
const getStaffDetails = async (staffId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(`${BASE_URL}/${staffId}`, config);
	return res.data;
};

// Edit staff account
const editStaffAccount = async ({ staffId, staffData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.put(`${BASE_URL}/${staffId}`, staffData, config);
	return res.data;
};

// Delete staff account
const deleteStaffAccount = async (staffId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.delete(`${BASE_URL}/${staffId}`, config);
	return res.data;
};

// Get doctor list
const getDoctorList = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(
		"http://localhost:5001/api/patient/doctor",
		config
	);
	return res.data;
};

const staffService = {
	createStaffAccount,
	getStaffAccounts,
	getStaffDetails,
	editStaffAccount,
	deleteStaffAccount,
	getDoctorList,
};

export default staffService;
