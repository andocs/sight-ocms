import axios from "axios";
const BASE_URL = "https://sight-ocms.vercel.app/api/users";

// Register user
const register = async (userData) => {
	const res = await axios.post(`${BASE_URL}/register`, userData);
	return res.data;
};

// Login user
const login = async (userData) => {
	const res = await axios.post(`${BASE_URL}/login`, userData);

	if (res.data) {
		localStorage.setItem("user", JSON.stringify(res.data.data));
	}

	return res.data;
};

//Logout user
const logout = () => {
	localStorage.removeItem("user");
};

//Add personal info
const addInfo = async (personalInfo, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/`;
	const res = await axios.post(url, personalInfo, config);
	return res.data;
};

// Get user
const getUser = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/`;
	const res = await axios.get(url, config);
	return res.data;
};

//Update personal info
const updateProfile = async (updateInfo, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/`;
	const res = await axios.put(url, updateInfo, config);
	return res.data;
};

//Update password
const changePassword = async (updateInfo, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const url = `${BASE_URL}/change-password`;
	const res = await axios.put(url, updateInfo, config);
	return res.data;
};

const authService = {
	register,
	logout,
	login,
	addInfo,
	getUser,
	updateProfile,
	changePassword,
};

export default authService;
