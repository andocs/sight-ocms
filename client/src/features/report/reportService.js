import axios from "axios";
import jwt_decode from "jwt-decode";
const BASE_URL = "http://localhost:5001/api";

// Generate weekly staff report
const getWeeklyStaff = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/staff/weekly`;
	const res = await axios.get(url, config);
	return res.data;
};

// Generate monthly staff report
const getMonthlyStaff = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/staff/monthly`;
	const res = await axios.get(url, config);
	return res.data;
};

const getUserRole = (token) => {
	const decodedToken = jwt_decode(token);
	const userRole = decodedToken.user.role;
	return userRole;
};

const reportService = {
	getWeeklyStaff,
	getMonthlyStaff,
};

export default reportService;
