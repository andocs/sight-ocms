import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getPendingOrders,
	editOrder,
	reset,
	clear,
} from "../../features/order/orderSlice";

import Spinner from "../../components/spinner.component";
import AcceptConfirmation from "../../components/acceptconfirmation.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewPendingOrders() {
	const [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	const [orderId, setOrderId] = useState("");
	const [isViewOpen, setViewOpen] = useState(false);
	const [orderData, setOrderData] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { order, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.order
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getPendingOrders());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [isError, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	function closeModal() {
		setIsOpen(false);
	}

	function openModal(orderId) {
		setIsOpen(true);
		setOrderId(orderId);
	}

	function checkConfirmation() {
		const orderData = { status: "In Progress" };
		setConfirmation(true);
		dispatch(editOrder({ orderId, orderData }));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
	}

	function closeViewModal() {
		setViewOpen(false);
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

	const viewColumns = [
		{ header: "Order Time", field: "orderTime" },
		{ header: "Status", field: "status" },
		{ header: "Total Amount", field: "amount" },
		{ header: "Doctor FName", field: "doctorLastName" },
		{ header: "Doctor LName", field: "doctorFirstName" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Lens", field: "lensName" },
		{ header: "Lens Price", field: "lensPrice" },
		{ header: "Lens Quantity", field: "lensQuantity" },
		{ header: "Frame", field: "frameName" },
		{ header: "Frame Price", field: "framePrice" },
		{ header: "Frame Quantity", field: "frameQuantity" },
		{ header: "Other Items", field: "otherItems" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setOrderData(details);
				setViewOpen(true);
			},
		},
		{
			label: "Accept",
			handler: (details) => {
				openModal(details._id);
			},
		},
	];
	return (
		<>
			{isViewOpen && (
				<ViewModal
					isOpen={isViewOpen}
					closeModal={closeViewModal}
					dataFields={orderData}
					columnHeaders={viewColumns}
					modalTitle="View Order Details"
				/>
			)}

			<AcceptConfirmation
				text={"Accept"}
				isOpen={isOpen}
				closeModal={closeModal}
				onConfirm={checkConfirmation}
			/>

			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Pending Orders</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={order} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewPendingOrders;
