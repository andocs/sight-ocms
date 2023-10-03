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

function getReducerByUserRole() {
	const token = localStorage.getItem("user");
	if (!token) {
		return { auth: authReducer, audit: auditReducer };
	}

	const decodedToken = decode(token);
	const userRole = decodedToken.user.role;

	if (userRole === "admin") {
		return {
			auth: authReducer,
			audit: auditReducer,
			staff: staffReducer,
			inventory: inventoryReducer,
			maintenance: maintenanceReducer,
			report: reportReducer,
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
		};
	} else if (userRole === "technician") {
		return {
			auth: authReducer,
			audit: auditReducer,
			order: orderReducer,
			inventory: inventoryReducer,
			maintenance: maintenanceReducer,
		};
	} else if (userRole === "patient") {
		return {
			auth: authReducer,
			audit: auditReducer,
			record: recordReducer,
			order: orderReducer,
			appointment: appointmentReducer,
			schedule: scheduleReducer,
		};
	}
}

export const store = configureStore({
	reducer: getReducerByUserRole(),
});
