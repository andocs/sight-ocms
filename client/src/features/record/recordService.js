import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = "http://localhost:5001/api";

// Create new record
const createEyeRecord = async ({ patientId, recordData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/record/${patientId}`;
	const res = await axios.post(url, recordData, config);
	return res.data;
};

// Get all eye records
const getEyeRecords = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/record`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get eye record details
const getRecordDetails = async (recordId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/record/${recordId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Edit eye record
const editEyeRecord = async ({ recordId, recordData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/record/${recordId}`;
	const res = await axios.put(url, recordData, config);
	return res.data;
};

// Delete eye record
const deleteEyeRecord = async (recordId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/record/${recordId}`;
	const res = await axios.delete(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const recordService = {
	createEyeRecord,
	getEyeRecords,
	getRecordDetails,
	editEyeRecord,
	deleteEyeRecord,
};

export default recordService;
