import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = "http://localhost:5001/api";

// Generate weekly technician report
const getWeeklyTech = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/technician/weekly`;
	const res = await axios.get(url, config);
	return res.data;
};

// Generate monthly technician report
const getMonthlyTech = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/technician/monthly`;
	const res = await axios.get(url, config);
	return res.data;
};

// Generate weekly technician report
const getWeeklyDoc = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/doctor/weekly`;
	const res = await axios.get(url, config);
	return res.data;
};

// Generate monthly technician report
const getMonthlyDoc = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/doctor/monthly`;
	const res = await axios.get(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const reportService = {
	getWeeklyTech,
	getMonthlyTech,
	getWeeklyDoc,
	getMonthlyDoc,
};

export default reportService;
