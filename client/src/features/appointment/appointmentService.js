import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = "https://sight-lyart.vercel.app/api";

// Create appointment record
const createAppointment = async ({ patientId, appointmentData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/appointments/${patientId}`;
	const res = await axios.post(url, appointmentData, config);
	return res.data;
};

// Schedule appointment
const scheduleAppointment = async (appointmentData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/appointments`;
	const res = await axios.post(url, appointmentData, config);
	return res.data;
};

// Get all appointment records
const getAppointmentList = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/appointments`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get all pending appointments
const getPendingAppointments = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/pending`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get all scheduled appointments
const getScheduledAppointments = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/scheduled`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get all confirmed appointments
const getConfirmedAppointments = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/confirmed`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get appointment record details
const getAppointmentDetails = async (appointmentId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/appointments/${appointmentId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Edit appointment record
const editAppointment = async ({ appointmentId, appointmentData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/appointments/${appointmentId}`;
	const res = await axios.put(url, appointmentData, config);
	return res.data;
};

// Delete appointment record
const deleteAppointment = async (appointmentId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/appointments/${appointmentId}`;
	const res = await axios.delete(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const appointmentService = {
	createAppointment,
	scheduleAppointment,
	getAppointmentList,
	getPendingAppointments,
	getScheduledAppointments,
	getConfirmedAppointments,
	getAppointmentDetails,
	editAppointment,
	deleteAppointment,
};

export default appointmentService;
