import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = "https://sight-ocms.vercel.app/api";

// Create patient record
const createPatientRecord = async (patientData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/patient`;
	const res = await axios.post(url, patientData, config);
	return res.data;
};

// Get all patient records
const getPatientList = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/patient`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get patient record details
const getPatientDetails = async (patientId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/patient/${patientId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get patient history
const getPatientHistory = async (patientId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/patient/history/${patientId}`;
	const res = await axios.get(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const patientService = {
	createPatientRecord,
	getPatientList,
	getPatientDetails,
	getPatientHistory,
};

export default patientService;
