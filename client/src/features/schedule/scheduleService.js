import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = "https://sight-lyart.vercel.app/api";

// Create schedule
const createSchedule = async (scheduleData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/schedule`;
	const res = await axios.post(url, scheduleData, config);
	return res.data;
};

// Get all schedule records
const getScheduleList = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/schedule`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get available days
const getAvailableDays = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/available`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get schedule record details
const getScheduleDetails = async (scheduleId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/schedule/${scheduleId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Edit schedule record
const editSchedule = async ({ scheduleId, scheduleData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/schedule/${scheduleId}`;
	const res = await axios.put(url, scheduleData, config);
	return res.data;
};

// Delete schedule record
const deleteSchedule = async (scheduleId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/schedule/${scheduleId}`;
	const res = await axios.delete(url, config);
	return res.data;
};

// Get all schedule records
const getDoctorSchedule = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/patient/schedule`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get all schedule records
const getDoctors = async () => {
	const url = `${BASE_URL}/users/schedule`;
	const res = await axios.get(url);
	return res.data;
};

// Add a break
const addBreak = async (breakData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/breaks`;
	const res = await axios.post(url, breakData, config);
	return res.data;
};

// Get all break records
const getBreakList = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/breaks`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get break record details
const getBreakDetails = async (breakId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/breaks/${breakId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Update break record
const updateBreak = async ({ breakId, breakData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/breaks/${breakId}`;
	const res = await axios.put(url, breakData, config);
	return res.data;
};

// Delete break record
const deleteBreak = async (breakId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/breaks/${breakId}`;
	const res = await axios.delete(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const scheduleService = {
	createSchedule,
	getScheduleList,
	getAvailableDays,
	getScheduleDetails,
	editSchedule,
	deleteSchedule,
	getDoctorSchedule,
	getDoctors,
	addBreak,
	getBreakList,
	getBreakDetails,
	updateBreak,
	deleteBreak,
};

export default scheduleService;
