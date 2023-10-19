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
import Profile from "./pages/Landing_Page/Profile";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import TechnicianDashboard from "./pages/Technician/TechnicianDashboard";

//PATIENT
import ViewPatientOrders from "./pages/Patient/ViewOrders";
import ViewRecords from "./pages/Patient/ViewRecords";
import ViewPendingAppointments from "./pages/Patient/ViewPendingAppointments";
import ViewPatientAppointments from "./pages/Patient/ViewPatientAppointments";
import AddAppointment from "./pages/Patient/AddAppointment";
import ViewDoctors from "./pages/Patient/ViewDoctors";
import ViewRepairs from "./pages/Patient/ViewRepairs";

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
import ViewPendingRequests from "./pages/Admin/ViewPendingRequests";
import ViewRequests from "./pages/Admin/ViewRequests";
import RequestDetails from "./pages/Admin/RequestDetails";
import ReportGeneration from "./pages/Admin/ReportGeneration";

//DOCTOR
import AddRecords from "./pages/Doctor/AddRecords";
import WalkInConsult from "./pages/Doctor/WalkInConsult";
import RegisteredConsult from "./pages/Doctor/RegisteredConsult";
import ViewEyeRecords from "./pages/Doctor/ViewRecords";
import ViewPending from "./pages/Doctor/ViewPending";
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
import ViewPatients from "./pages/Doctor/ViewPatients";
import ViewPatientHistory from "./pages/Doctor/ViewPatientHistory";
import ViewRepair from "./pages/Doctor/ViewRepair";
import CreateRepair from "./pages/Doctor/CreateRepair";
import ViewPendingRepair from "./pages/Doctor/ViewPendingRepair";

//TECHNICIAN
import ViewPendingOrders from "./pages/Technician/ViewPendingOrders";
import ViewOrderHistory from "./pages/Technician/ViewOrderHistory";
import ViewMaintenance from "./pages/Technician/ViewMaintenance";
import CreateMaintenanceRequest from "./pages/Technician/CreateMaintenanceRequest";
import ViewTechInventory from "./pages/Technician/ViewTechInventory";
import EditRequest from "./pages/Technician/EditRequest";
import TechItemDetails from "./pages/Technician/ItemDetails";
import ViewRepairHistory from "./pages/Technician/ViewRepairHistory";
import ViewPendingTech from "./pages/Technician/ViewPendingTech";

//STAFF
import StaffDashboard from "./pages/Staff/StaffDashboard";
import ViewPatientStaff from "./pages/Staff/ViewPatientStaff";
import ViewPatientHistoryStaff from "./pages/Staff/ViewPatientHistoryStaff";
import ViewVisitStaff from "./pages/Staff/ViewVisitStaff";
import ViewScheduledStaff from "./pages/Staff/ViewScheduledStaff";
import ViewConfirmedStaff from "./pages/Staff/ViewConfirmedStaff";
import ViewAppointmentStaff from "./pages/Staff/ViewAppointmentStaff";
import PDFViewer from "./pages/Admin/PDFViewer";

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
					<Route path="/profile" element={<Profile />} />

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
						<Route path="view-pending" element={<ViewPendingRequests />} />
						<Route path="view-requests" element={<ViewRequests />} />
						<Route path="request-details" element={<RequestDetails />} />
						<Route path="view-logs" element={<ViewAuditLogs />} />
						<Route path="report-generation" element={<ReportGeneration />} />
					</Route>

					<Route path="/patient" element={<PatientDashboard />}>
						<Route path="view-records" element={<ViewRecords />} />
						<Route path="view-orders" element={<ViewPatientOrders />} />
						<Route path="add-appointment" element={<AddAppointment />} />
						<Route path="add-appointment/:id" element={<AddAppointment />} />
						<Route path="view-pending" element={<ViewPendingAppointments />} />
						<Route
							path="view-appointments"
							element={<ViewPatientAppointments />}
						/>
						<Route path="view-doctors" element={<ViewDoctors />} />
						<Route path="view-repairs" element={<ViewRepairs />} />
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
						<Route path="view-pending" element={<ViewPending />} />
						<Route path="edit-schedule/:id" element={<EditSchedule />} />
						<Route path="add-patient" element={<AddPatient />} />
						<Route path="view-patients" element={<ViewPatients />} />
						<Route
							path="view-patient-history/:id"
							element={<ViewPatientHistory />}
						/>
						<Route path="view-repair" element={<ViewRepair />} />
						<Route path="pending-repairs" element={<ViewPendingRepair />} />
						<Route path="add-repair" element={<CreateRepair />} />
						<Route path="add-repair/:id" element={<CreateRepair />} />
					</Route>

					<Route path="/technician" element={<TechnicianDashboard />}>
						<Route path="view-orders" element={<ViewPendingOrders />} />
						<Route path="view-history" element={<ViewOrderHistory />} />
						<Route path="view-requests" element={<ViewMaintenance />} />
						<Route path="add-request" element={<CreateMaintenanceRequest />} />
						<Route path="edit-request/:id" element={<EditRequest />} />
						<Route path="view-inventory" element={<ViewTechInventory />} />
						<Route path="item-details" element={<TechItemDetails />} />
						<Route path="view-repair-history" element={<ViewRepairHistory />} />
						<Route path="pending-repairs" element={<ViewPendingTech />} />
					</Route>

					<Route path="/staff" element={<StaffDashboard />}>
						<Route path="view-patients" element={<ViewPatientStaff />} />
						<Route
							path="view-patient-history/:id"
							element={<ViewPatientHistoryStaff />}
						/>
						<Route path="view-visits" element={<ViewVisitStaff />} />
						<Route path="view-scheduled" element={<ViewScheduledStaff />} />
						<Route path="view-confirmed" element={<ViewConfirmedStaff />} />
						<Route
							path="view-appointments"
							element={<ViewAppointmentStaff />}
						/>
					</Route>
					<Route exact path="view-pdf/:id" element={<PDFViewer />} />
				</Routes>
			</BrowserRouter>
			<ToastContainer />
		</div>
	);
}

export default App;
