import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getOrderHistory,
	editOrder,
	reset,
	clear,
} from "../../features/order/orderSlice";

import Spinner from "../../components/spinner.component";
import AcceptConfirmation from "../../components/acceptconfirmation.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewOrderHistory() {
	let [isCancelOpen, setCancelOpen] = useState(false);
	const [isCancelConfirmed, setCancelConfirmation] = useState(false);
	let [isCompleteOpen, setCompleteOpen] = useState(false);
	const [isCompleteConfirmed, setCompleteConfirmation] = useState(false);
	const [orderId, setOrderId] = useState("");
	let [isViewOpen, setViewOpen] = useState(false);
	const [orderData, setOrderData] = useState("");

	const dispatch = useDispatch();
	const { orderHistory, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.order
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getOrderHistory());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [isError, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	function closeCancelModal() {
		setCancelOpen(false);
		setOrderId("");
	}

	function openCancelModal(orderId) {
		setCancelOpen(true);
		setOrderId(orderId);
	}

	function checkCancelConfirmation() {
		const orderData = { status: "Cancelled" };
		setCancelConfirmation(true);
		dispatch(editOrder({ orderId, orderData }));
		if (isSuccess && message) {
			toast.message(message);
		}
		setCancelOpen(false);
	}

	function closeCompletedModal() {
		setCompleteOpen(false);
		setOrderId("");
	}

	function openCompletedModal(orderId) {
		setCompleteOpen(true);
		setOrderId(orderId);
	}

	function checkCompletedConfirmation() {
		const orderData = { status: "Completed" };
		setCompleteConfirmation(true);
		dispatch(editOrder({ orderId, orderData }));
		if (isSuccess && message) {
			toast.message(message);
		}
		setCompleteOpen(false);
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
		{ header: "Accepted Time", field: "acceptTime" },
		{ header: "Completed Time", field: "completeTime" },
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
			label: "Complete",
			handler: (details) => {
				openCompletedModal(details._id);
			},
		},
		{
			label: "Cancel",
			handler: (details) => {
				openCancelModal(details._id);
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
				text={"Complete"}
				isOpen={isCompleteOpen}
				closeModal={closeCompletedModal}
				onConfirm={checkCompletedConfirmation}
			/>

			<AcceptConfirmation
				text={"Cancel"}
				isOpen={isCancelOpen}
				closeModal={closeCancelModal}
				onConfirm={checkCancelConfirmation}
			/>

			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">View Order History</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={orderHistory} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewOrderHistory;
