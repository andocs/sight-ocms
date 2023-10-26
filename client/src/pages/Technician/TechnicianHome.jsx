import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	getOrderHistory,
	getPendingOrders,
	reset,
	clear,
} from "../../features/order/orderSlice";

import { getInventoryItems } from "../../features/inventory/inventorySlice";
import { getMaintenanceList } from "../../features/maintenance/maintenanceSlice";
import { getUser } from "../../features/auth/authSlice";

import DashComponent from "../../components/dashboard.component";
import Spinner from "../../components/spinner.component";

const text =
	"Hey there, technician! Welcome to your dashboard. You can view the patient's orders and also create maintenance requests here";

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

const inventorysvg = (
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
			d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
		/>
	</svg>
);

const requestsvg = (
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
			d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
		/>
	</svg>
);

function TechnicianHome() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { order, orderHistory, isLoading } = useSelector(
		(state) => state.order
	);
	const { item } = useSelector((state) => state.inventory);
	const { maintenance } = useSelector((state) => state.maintenance);
	const { infoUpdate } = useSelector((state) => state.auth);

	const onHeaderClick = () => {
		navigate("/technician/add-request");
	};
	const onDisplayClick = () => {
		navigate("/technician/view-orders");
	};

	useEffect(() => {
		dispatch(getOrderHistory());
		dispatch(getPendingOrders());
		dispatch(getInventoryItems());
		dispatch(getMaintenanceList());
		dispatch(getUser());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [dispatch]);

	const status = [
		{
			number: Object.keys(order).length,
			text: "Pending Orders",
			svg: pendingsvg,
		},
		{
			number: orderHistory.filter((status) => status.status === "Completed")
				.length,
			text: "Completed Orders",
			svg: ordersvg,
		},

		{
			number: Object.keys(item).length,
			text: "Inventory Items",
			svg: inventorysvg,
		},
		{
			number: maintenance.filter((status) => status.status === "In Progress")
				.length,
			text: "In Progress Requests",
			svg: requestsvg,
		},
	];

	const header = {
		title: "Dashboard",
		color: "blue",
		button: "Create Request",
	};

	const display = {
		role: infoUpdate?.role,
		button: "View Pending Orders",
		color: "sky",
	};

	const props = {
		textcolor: "text-sky-800",
		header,
		display,
		username:
			`${infoUpdate?.personalInfo.fname} ${infoUpdate?.personalInfo.lname}` ||
			"John Doe",
		text,
	};

	if (isLoading) {
		return <Spinner />;
	}

	const columns = [
		{ header: "Order Time", field: "orderTime" },
		{ header: "Status", field: "status" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Lens", field: `lensName` },
		{ header: "Frame", field: "frameName" },
		{ header: "Other Items", field: "otherItems" },
	];

	const table = {
		header: "Pending Orders",
		data: order,
		columns,
	};

	return (
		<>
			{order && orderHistory && item && maintenance && (
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

export default TechnicianHome;
