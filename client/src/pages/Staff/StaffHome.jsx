import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	getPendingAppointments,
	getScheduledAppointments,
	getConfirmedAppointments,
	reset,
	clear,
} from "../../features/appointment/appointmentSlice";

import { getPatientList } from "../../features/patient/patientSlice";
import { getUser } from "../../features/auth/authSlice";

import DashComponent from "../../components/dashboard.component";
import Spinner from "../../components/spinner.component";

const text =
	"Greetings! Welcome to your dashboard. All you need to manage patients and appointments can be found here.";

const pendingsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={2}
		stroke="currentColor"
		className="w-6 h-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

const scheduledsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={2}
		stroke="currentColor"
		className="w-6 h-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
		/>
	</svg>
);

const appointmentsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={2}
		stroke="currentColor"
		className="w-6 h-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
		/>
	</svg>
);

const patientsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={2}
		stroke="currentColor"
		className="w-6 h-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
		/>
	</svg>
);

function StaffHome() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { pending, confirmed, scheduled, isLoading } = useSelector(
		(state) => state.appointment
	);
	const { patient } = useSelector((state) => state.patient);
	const { info } = useSelector((state) => state.auth);

	const onHeaderClick = () => {
		navigate("/staff/view-confirmed");
	};
	const onDisplayClick = () => {
		navigate("/doctor/view-appointments");
	};

	useEffect(() => {
		dispatch(getPendingAppointments());
		dispatch(getConfirmedAppointments());
		dispatch(getScheduledAppointments());
		dispatch(getPatientList());
		dispatch(getUser());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [dispatch]);

	if (isLoading) {
		return <Spinner />;
	}
	const today = new Date();

	const status = [
		{
			number: Object.keys(patient).length,
			text: "Registered Patients",
			svg: patientsvg,
		},
		{
			number: confirmed.filter(
				(date) =>
					new Date(date.appointmentDate).getFullYear() ===
						today.getFullYear() &&
					new Date(date.appointmentDate).getMonth() === today.getMonth() &&
					new Date(date.appointmentDate).getDate() === today.getDate()
			).length,
			text: "Appointments Today",
			svg: appointmentsvg,
		},
		{
			number: Object.keys(pending).length,
			text: "Pending Appointments",
			svg: pendingsvg,
		},
		{
			number: Object.keys(scheduled).length,
			text: "Scheduled Appointments",
			svg: scheduledsvg,
		},
	];

	const header = {
		title: "Dashboard",
		color: "blue",
		button: "View Confirmed Appointments",
	};

	const display = {
		role: info?.role,
		button: "View Appointment List",
		color: "sky",
	};

	const props = {
		textcolor: "text-sky-800",
		header,
		display,
		username:
			`${info?.personalInfo.fname} ${info?.personalInfo.lname}` || "John Doe",
		text,
	};

	const columns = [
		{ header: "Start Time", field: `appointmentStart` },
		{ header: "End Time", field: "appointmentEnd" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Notes", field: "notes" },
	];

	const table = {
		header: "Appointments For Today",
		data: confirmed.filter(
			(date) =>
				new Date(date.appointmentDate).getFullYear() === today.getFullYear() &&
				new Date(date.appointmentDate).getMonth() === today.getMonth() &&
				new Date(date.appointmentDate).getDate() === today.getDate()
		),
		columns,
	};

	return (
		<>
			{pending && confirmed && scheduled && (
				<DashComponent
					props={props}
					status={status}
					headerClick={onHeaderClick}
					displayClick={onDisplayClick}
					table={table}
				/>
			)}
		</>
	);
}

export default StaffHome;
