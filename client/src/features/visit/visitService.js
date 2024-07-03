import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = "https://sight-lyart.vercel.app/api";

// Create visit record
const createVisitRecord = async ({ patientId, visitData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/visit/${patientId}`;
	const res = await axios.post(url, visitData, config);
	return res.data;
};

// Get all visit records
const getVisitList = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/visit`;
	const res = await axios.get(url, config);
	return res.data;
};

// Get visit record details
const getVisitDetails = async (visitId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/visit/${visitId}`;
	const res = await axios.get(url, config);
	return res.data;
};

// Edit visit record
const editVisitRecord = async ({ visitId, visitData }, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/visit/${visitId}`;
	const res = await axios.put(url, visitData, config);
	return res.data;
};

// Delete visit record
const deleteVisitRecord = async (visitId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/visit/${visitId}`;
	const res = await axios.delete(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const visitService = {
	createVisitRecord,
	getVisitList,
	getVisitDetails,
	editVisitRecord,
	deleteVisitRecord,
};

export default visitService;
