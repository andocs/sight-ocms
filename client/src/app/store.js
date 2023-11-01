import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import auditReducer from "../features/audit/auditSlice";

import decode from "jwt-decode";
import staffReducer from "../features/staff/staffSlice";
import inventoryReducer from "../features/inventory/inventorySlice";
import visitReducer from "../features/visit/visitSlice";
import recordReducer from "../features/record/recordSlice";
import appointmentReducer from "../features/appointment/appointmentSlice";
import orderReducer from "../features/order/orderSlice";
import scheduleReducer from "../features/schedule/scheduleSlice";
import patientReducer from "../features/patient/patientSlice";
import maintenanceReducer from "../features/maintenance/maintenanceSlice";
import reportReducer from "../features/report/reportSlice";
import repairReducer from "../features/repair/repairSlice";

function getReducerByUserRole() {
	const token = localStorage.getItem("user");
	if (!token) {
		return {
			auth: authReducer,
			audit: auditReducer,
			appointment: appointmentReducer,
			staff: staffReducer,
			order: orderReducer,
			record: recordReducer,
			inventory: inventoryReducer,
			maintenance: maintenanceReducer,
			patient: patientReducer,
			schedule: scheduleReducer,
		};
	}

	const decodedToken = decode(token);
	const userRole = decodedToken.user.role;

	if (userRole === "admin") {
		return {
			auth: authReducer,
			audit: auditReducer,
			staff: staffReducer,
			order: orderReducer,
			inventory: inventoryReducer,
			maintenance: maintenanceReducer,
			report: reportReducer,
			schedule: scheduleReducer,
		};
	} else if (userRole === "doctor") {
		return {
			auth: authReducer,
			audit: auditReducer,
			visit: visitReducer,
			record: recordReducer,
			appointment: appointmentReducer,
			order: orderReducer,
			schedule: scheduleReducer,
			patient: patientReducer,
			repair: repairReducer,
		};
	} else if (userRole === "technician") {
		return {
			auth: authReducer,
			audit: auditReducer,
			order: orderReducer,
			inventory: inventoryReducer,
			maintenance: maintenanceReducer,
			repair: repairReducer,
			schedule: scheduleReducer,
		};
	} else if (userRole === "patient") {
		return {
			auth: authReducer,
			audit: auditReducer,
			record: recordReducer,
			staff: staffReducer,
			order: orderReducer,
			appointment: appointmentReducer,
			schedule: scheduleReducer,
			repair: repairReducer,
		};
	} else if (userRole === "staff") {
		return {
			auth: authReducer,
			audit: auditReducer,
			appointment: appointmentReducer,
			patient: patientReducer,
			schedule: scheduleReducer,
			visit: visitReducer,
		};
	}
}

export const store = configureStore({
	reducer: getReducerByUserRole(),
});
