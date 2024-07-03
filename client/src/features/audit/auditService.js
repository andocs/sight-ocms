import axios from "axios";
const BASE_URL = process.env.BASE_URL +="api/admin";

// Get all audit logs
const getAuditLogs = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(`${BASE_URL}/log`, config);
	return res.data;
};

// Get audit log details
const getLogDetails = async (logId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(`${BASE_URL}/log/${logId}`, config);
	return res.data;
};

const auditService = {
	getAuditLogs,
	getLogDetails,
};

export default auditService;
