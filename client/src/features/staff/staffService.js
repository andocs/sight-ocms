import axios from 'axios';
const BASE_URL = "http://localhost:5001/api/admin";

// Create staff account
const createStaffAccount = async (userData, token) => {
  const config = {
      headers:{
          Authorization: `Bearer ${token}`
      }
  }
  const res = await axios.post(`${BASE_URL}/register`, userData, config)
  console.log(res.error);
  return res.data
}

// Edit staff account
const editStaffAccount = async (staffData) => {
  const res = await axios.put(`${BASE_URL}/staff/${staffData.id}`, staffData);
  return res.data;
};

// Delete staff account
const deleteStaffAccount = async (staffId) => {
  await axios.delete(`${BASE_URL}/staff/${staffId}`);
};

const staffService = {
  createStaffAccount,
  editStaffAccount,
  deleteStaffAccount,
};

export default staffService;
