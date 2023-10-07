import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	getAppointmentList,
	reset,
	clear,
} from "../../features/appointment/appointmentSlice";

import { getDoctorList } from "../../features/staff/staffSlice";
import { getOrderList } from "../../features/order/orderSlice";
import { getEyeRecords } from "../../features/record/recordSlice";

import decode from "jwt-decode";
import DashComponent from "../../components/dashboard.component";
import Spinner from "../../components/spinner.component";

const text = `Hey there, partner! Welcome to your dashboard. Want to schedule an appointment? Why not go ahead to 'All Doctors'. You can also see your previous Eye Records and Orders here.`;

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

const doctorsvg = (
	<svg
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={2}
		viewBox="0 0 24 24"
		className="w-6 h-6"
	>
		<path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" />
		<path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4" />
		<path d="M22 10 A2 2 0 0 1 20 12 A2 2 0 0 1 18 10 A2 2 0 0 1 22 10 z" />
	</svg>
);

const ordersvg = (
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
			d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
		/>
	</svg>
);

const recordsvg = (
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
			d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
		/>
	</svg>
);

function PatientHome() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { appointment, isLoading } = useSelector((state) => state.appointment);

	const { staff } = useSelector((state) => state.staff);
	const { order } = useSelector((state) => state.order);
	const { record } = useSelector((state) => state.record);

	const token = localStorage.getItem("user");

	const decodedToken = decode(token);
	const name = decodedToken.user.name || "John Doe";
	const role = decodedToken.user.role;

	const onHeaderClick = () => {
		navigate("/patient/view-records");
	};

	const onDisplayClick = () => {
		navigate("/patient/view-doctors");
	};

	const header = {
		title: "Dashboard",
		color: "blue",
		button: "View Records",
	};

	const display = {
		role,
		button: "View Doctors",
		color: "sky",
	};

	const props = {
		textcolor: "text-gray-100",
		header,
		display,
		username: name,
		text,
	};

	useEffect(() => {
		dispatch(getAppointmentList());
		dispatch(getDoctorList());
		dispatch(getOrderList());
		dispatch(getEyeRecords());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [dispatch]);

	const status = [
		{
			number: Object.keys(staff).length,
			text: "All Doctors",
			svg: doctorsvg,
		},
		{
			number: appointment.filter((date) => date.appointmentDate === new Date())
				.length,
			text: "Appointments Today",
			svg: appointmentsvg,
		},
		{
			number: order.filter((status) => status.status === "In Progress").length,
			text: "Orders In Progress",
			svg: ordersvg,
		},
		{
			number: Object.keys(record).length,
			text: "Total Eye Records",
			svg: recordsvg,
		},
	];

	if (isLoading) {
		return <Spinner />;
	}

	const columns = [
		{ header: "Start Time", field: `appointmentStart` },
		{ header: "End Time", field: "appointmentEnd" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Notes", field: "notes" },
	];

	const table = {
		header: "Appointments For Today",
		data: appointment.filter((date) => date.appointmentDate === new Date()),
		columns,
	};

	return (
		<>
			{appointment && staff && record && order && (
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
export default PatientHome;
