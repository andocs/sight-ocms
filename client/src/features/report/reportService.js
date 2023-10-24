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

// Generate inventory report
const getInventoryReport = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/inventory`;
	const res = await axios.get(url, config);
	return res.data;
};

// Generate weekly order report
const getWeeklyOrd = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/order/weekly`;
	const res = await axios.get(url, config);
	return res.data;
};

// Generate monthly order report
const getMonthlyOrd = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/order/monthly`;
	const res = await axios.get(url, config);
	return res.data;
};

// Generate batches report
const getBatches = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/batches`;
	const res = await axios.get(url, config);
	return res.data;
};

// Generate monthly sales report
const getMonthlySales = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/sales/monthly`;
	const res = await axios.get(url, config);
	return res.data;
};

// Generate quarterly sales report
const getQuarterlySales = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/${getUserRole(token)}/report/sales/quarterly`;
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

	getInventoryReport,
	getWeeklyOrd,
	getMonthlyOrd,
	getBatches,
	getQuarterlySales,
	getMonthlySales,
};

export default reportService;
