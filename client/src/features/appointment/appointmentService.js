import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = "http://localhost:5001/api";

// Create appointment record
const createAppointment = async ({ patientId, appointmentData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/appointment/${patientId}`;
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
	const url = `${BASE_URL}/${getUserRole(token)}/appointment`;
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
	const url = `${BASE_URL}/${getUserRole(token)}/appointment/${appointmentId}`;
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
	const url = `${BASE_URL}/${getUserRole(token)}/appointment/${appointmentId}`;
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
	const url = `${BASE_URL}/${getUserRole(token)}/appointment/${appointmentId}`;
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
	getAppointmentList,
	getAppointmentDetails,
	editAppointment,
	deleteAppointment,
};

export default appointmentService;
