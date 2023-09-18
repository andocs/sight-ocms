import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/navbar.component";

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

//DOCTOR
import AddRecords from "./pages/Doctor/AddRecords";
import WalkInConsult from "./pages/Doctor/WalkInConsult";
import RegisteredConsult from "./pages/Doctor/RegisteredConsult";
import ViewEyeRecords from "./pages/Doctor/ViewRecords";
import ViewAppointments from "./pages/Doctor/ViewAppointments";
import AddAppointments from "./pages/Doctor/AddAppointments";
import ViewOrders from "./pages/Doctor/ViewOrders";
import AddOrders from "./pages/Doctor/AddOrders";
import AddPatient from "./pages/Doctor/AddPatient";
import ViewVisits from "./pages/Doctor/ViewVisits";
import AddVisit from "./pages/Doctor/AddVisit";
import ViewSchedule from "./pages/Doctor/ViewSchedule";
import AddSchedule from "./pages/Doctor/AddSchedule";
import EditVisit from "./pages/Doctor/EditVisit";
import EditRecord from "./pages/Doctor/EditRecord";
import EditOrders from "./pages/Doctor/EditOrders";
import EditAppointment from "./pages/Doctor/EditAppointment";
import EditSchedule from "./pages/Doctor/EditSchedule";

//TECHNICIAN
import ViewPendingOrders from "./pages/Technician/ViewPendingOrders";
import ViewOrderHistory from "./pages/Technician/ViewOrderHistory";
import ViewMaintenance from "./pages/Technician/ViewMaintenance";
import CreateMaintenanceRequest from "./pages/Technician/CreateMaintenanceRequest";
import ViewTechInventory from "./pages/Technician/ViewTechInventory";
import EditRequest from "./pages/Technician/EditRequest";
import TechItemDetails from "./pages/Technician/ItemDetails";

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
					</Route>

					<Route path="/patient" element={<PatientDashboard />}>
						<Route path="view-records" element={<ViewRecords />} />
						<Route path="view-order" element={<ViewOrder />} />
					</Route>

					<Route path="/doctor" element={<DoctorDashboard />}>
						<Route path="walk-in" element={<WalkInConsult />} />
						<Route path="registered" element={<RegisteredConsult />} />
						<Route path="add-visit" element={<AddVisit />} />
						<Route path="add-visit/:id" element={<AddVisit />} />
						<Route path="view-visits" element={<ViewVisits />} />
						<Route path="edit-visit/:id" element={<EditVisit />} />
						<Route path="add-record" element={<AddRecords />} />
						<Route path="add-record/:id" element={<AddRecords />} />
						<Route path="view-records" element={<ViewEyeRecords />} />
						<Route path="edit-record/:id" element={<EditRecord />} />
						<Route path="add-appointment" element={<AddAppointments />} />
						<Route path="add-appointment/:id" element={<AddAppointments />} />
						<Route path="view-appointments" element={<ViewAppointments />} />
						<Route path="edit-appointment/:id" element={<EditAppointment />} />
						<Route path="add-order" element={<AddOrders />} />
						<Route path="add-order/:id" element={<AddOrders />} />
						<Route path="view-orders" element={<ViewOrders />} />
						<Route path="edit-order/:id" element={<EditOrders />} />
						<Route path="add-schedule" element={<AddSchedule />} />
						<Route path="view-schedule" element={<ViewSchedule />} />
						<Route path="edit-schedule/:id" element={<EditSchedule />} />
						<Route path="add-patient" element={<AddPatient />} />
					</Route>

					<Route path="/technician" element={<TechnicianDashboard />}>
						<Route path="view-orders" element={<ViewPendingOrders />} />
						<Route path="view-history" element={<ViewOrderHistory />} />
						<Route path="view-requests" element={<ViewMaintenance />} />
						<Route path="add-request" element={<CreateMaintenanceRequest />} />
						<Route path="edit-request/:id" element={<EditRequest />} />
						<Route path="view-inventory" element={<ViewTechInventory />} />
						<Route path="item-details" element={<TechItemDetails />} />
					</Route>
				</Routes>
			</BrowserRouter>
			<ToastContainer />
		</div>
	);
}

export default App;
