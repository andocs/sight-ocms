import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = "http://localhost:5001/api";

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

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const scheduleService = {
	createSchedule,
	getScheduleList,
	getScheduleDetails,
	editSchedule,
	deleteSchedule,
};

export default scheduleService;
