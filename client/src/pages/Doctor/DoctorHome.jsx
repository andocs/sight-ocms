import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	getPendingAppointments,
	getConfirmedAppointments,
	reset,
	clear,
} from "../../features/appointment/appointmentSlice";
import { getOrderList } from "../../features/order/orderSlice";
import { getEyeRecords } from "../../features/record/recordSlice";
import { getUser } from "../../features/auth/authSlice";

import DashComponent from "../../components/dashboard.component";
import Spinner from "../../components/spinner.component";

const text =
	"Hey there, doctor! Welcome to your dashboard. All you need to manage your patients and their records can be found here.";

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

function DoctorHome() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { pending, confirmed, isLoading } = useSelector(
		(state) => state.appointment
	);
	const { order } = useSelector((state) => state.order);
	const { record } = useSelector((state) => state.record);
	const { info } = useSelector((state) => state.auth);

	const onHeaderClick = () => {
		navigate("/doctor/add-record");
	};
	const onDisplayClick = () => {
		navigate("/doctor/view-appointments");
	};

	useEffect(() => {
		dispatch(getPendingAppointments());
		dispatch(getConfirmedAppointments());
		dispatch(getEyeRecords());
		dispatch(getOrderList());
		dispatch(getUser());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [dispatch]);

	const status = [
		{
			number: Object.keys(pending).length,
			text: "Pending Appointments",
			svg: pendingsvg,
		},
		{
			number: confirmed.filter((date) => date.appointmentDate === new Date())
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

	const header = {
		title: "Dashboard",
		color: "blue",
		button: "Add Records",
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
			`Dr. ${info?.personalInfo.fname} ${info?.personalInfo.lname}` ||
			"John Doe",
		text,
	};

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

	const today = new Date();
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
			{confirmed && record && order && (
				<DashComponent
					key={info}
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

export default DoctorHome;
