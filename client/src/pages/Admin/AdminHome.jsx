import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
	clear,
	getInventoryItems,
	reset,
} from "../../features/inventory/inventorySlice";
import { getPendingRequests } from "../../features/maintenance/maintenanceSlice";
import { getStaffAccounts } from "../../features/staff/staffSlice";

import decode from "jwt-decode";
import DashComponent from "../../components/dashboard.component";
import Spinner from "../../components/spinner.component";

const text =
	"Hey there, admin! Welcome to your dashboard. You can manage your staff, inventory, and maintenance requests here.";

const staffsvg = (
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
			d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
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

const techniciansvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.8}
		stroke="currentColor"
		className="w-6 h-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
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

function AdminHome() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { item, isLoading } = useSelector((state) => state.inventory);
	const { staff } = useSelector((state) => state.staff);
	const { maintenance } = useSelector((state) => state.maintenance);

	const token = localStorage.getItem("user");

	const decodedToken = decode(token);
	const name = decodedToken.user.name;
	const role = decodedToken.user.role;

	const onHeaderClick = () => {
		navigate("/admin/view-inventory");
	};
	const onDisplayClick = () => {
		navigate("/admin/view-staff");
	};

	const header = {
		title: "Dashboard",
		color: "blue",
		button: "Update Inventory",
	};

	const display = {
		role,
		button: "View Staff List",
		color: "sky",
	};
	const props = {
		textcolor: "text-sky-800",
		header,
		display,
		username: name,
		text,
	};

	useEffect(() => {
		dispatch(getInventoryItems());
		dispatch(getStaffAccounts());
		dispatch(getPendingRequests());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const status = [
		{
			number: staff.filter((role) => role.role === "doctor").length,
			text: "All Doctors",
			svg: doctorsvg,
		},
		{
			number: staff.filter((role) => role.role === "technician").length,
			text: "All Technicians",
			svg: techniciansvg,
		},
		{
			number: Object.keys(item).length,
			text: "Inventory Items",
			svg: inventorysvg,
		},
		{
			number: Object.keys(maintenance).length,
			text: "Pending Maintenance Requests",
			svg: staffsvg,
		},
	];
	const columns = [
		{ header: "Item", field: "itemName" },
		{ header: "Vendor", field: "vendor" },
		{ header: "Description", field: "description" },
		{ header: "Category", field: "category" },
		{ header: "Quantity", field: "quantity" },
		{ header: "Price", field: "price" },
	];

	const table = {
		header: "Inventory Status",
		data: item,
		columns,
	};

	return (
		<>
			{item && staff && maintenance && (
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

export default AdminHome;
