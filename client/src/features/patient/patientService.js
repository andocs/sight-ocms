import axios from "axios";
const BASE_URL = "http://localhost:5001/api/doctor";

// Create patient record
const createPatientRecord = async (patientData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/patient`;
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
	const url = `${BASE_URL}/patient`;
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
	const url = `${BASE_URL}/${patientId}`;
	const res = await axios.get(url, config);
	return res.data;
};

const patientService = {
	createPatientRecord,
	getPatientList,
	getPatientDetails,
};

export default patientService;
