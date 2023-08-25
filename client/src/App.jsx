import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Landing_Page/Home";
import Services from "./pages/Landing_Page/Services";
import About from "./pages/Landing_Page/About";
import Technology from "./pages/Landing_Page/Technology";
import Login from "./pages/Landing_Page/Login";
import Register from "./pages/Landing_Page/Register";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import TechnicianDashboard from "./pages/Technician/TechnicianDashboard";

//PATIENT
import ViewHistory from "./pages/Patient/ViewHistory";
import ViewOrder from "./pages/Patient/ViewOrder";
import ViewRecords from "./pages/Patient/ViewRecords";

//ADMIN
import AddStaff from "./pages/Admin/AddStaffAccount";
import ViewStaff from "./pages/Admin/ViewStaff";
import StaffDetails from "./pages/Admin/StaffDetails";
import EditStaff from "./pages/Admin/EditStaffAccount";
import AddItems from "./pages/Admin/AddItems";
import ViewInventory from "./pages/Admin/ViewInventory";
import ItemDetails from "./pages/Admin/ItemDetails";
import EditItem from "./pages/Admin/EditItem";
import RemoveItems from "./pages/Admin/RemoveItems";
import ViewAuditLogs from "./pages/Admin/ViewAuditLogs";
import LogDetails from "./pages/Admin/LogDetails";

//DOCTOR
import AddRecords from "./pages/Doctor/AddRecords";
import AddTransaction from "./pages/Doctor/AddTransaction";
import DeleteRecords from "./pages/Doctor/DeleteRecords";
import GeneratePrescription from "./pages/Doctor/GeneratePrescription";
import UpdateRecords from "./pages/Doctor/UpdateRecords";

import Navbar from "./components/navbar.component";

function App() {
	return (
		<div className="font-jost text-sky-800 h-screen flex flex-col overflow-hidden">
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Home />} />
					<Route path="/services" element={<Services />} />
					<Route path="/about" element={<About />} />
					<Route path="/technology" element={<Technology />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					<Route path="/admin" element={<AdminDashboard />}>
						<Route path="add-staff" element={<AddStaff />} />
						<Route path="view-staff" element={<ViewStaff />} />
						<Route path="staff-details" element={<StaffDetails />} />
						<Route path="edit-staff/:id" element={<EditStaff />} />
						<Route path="add-item" element={<AddItems />} />
						<Route path="view-inventory" element={<ViewInventory />} />
						<Route path="item-details" element={<ItemDetails />} />
						<Route path="edit-item/:id" element={<EditItem />} />
						<Route path="remove-item" element={<RemoveItems />} />
						<Route path="view-logs" element={<ViewAuditLogs />} />
						<Route path="log-details" element={<LogDetails />} />
					</Route>

					<Route path="/patient" element={<PatientDashboard />}>
						<Route path="view-records" element={<ViewRecords />} />
						<Route path="view-history" element={<ViewHistory />} />
						<Route path="view-order" element={<ViewOrder />} />
					</Route>

					<Route path="/doctor" element={<DoctorDashboard />}>
						<Route path="add-transaction" element={<AddTransaction />} />
						<Route path="add-records" element={<AddRecords />} />
						<Route path="delete-records" element={<DeleteRecords />} />
						<Route path="update-records" element={<UpdateRecords />} />
						<Route path="gen-prescription" element={<GeneratePrescription />} />
					</Route>

					<Route path="/technician" element={<TechnicianDashboard />} />
				</Routes>
			</BrowserRouter>
			<ToastContainer />
		</div>
	);
}

export default App;
