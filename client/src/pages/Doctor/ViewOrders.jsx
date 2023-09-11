import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getOrderList,
	deleteOrder,
	reset,
	clear,
} from "../../features/order/orderSlice";

import Spinner from "../../components/spinner.component";
import DeleteConfirmation from "../../components/deleteconfirmation.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewOrders() {
	let [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	let [isViewOpen, setViewOpen] = useState(false);
	const [orderId, setOrderId] = useState("");
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
		dispatch(getOrderList());
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

	function closeViewModal() {
		setViewOpen(false);
	}

	function openModal(orderId) {
		setIsOpen(true);
		setOrderId(orderId);
	}

	function checkConfirmation() {
		setConfirmation(true);
		dispatch(deleteOrder(orderId));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
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
				console.log(details);
				setViewOpen(true);
			},
		},
		{
			label: "Update",
			handler: (details) => {
				navigate(`/doctor/edit-order/${details._id}`, { state: { details } });
			},
		},
		{
			label: "Delete",
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

			<DeleteConfirmation
				isOpen={isOpen}
				closeModal={closeModal}
				onConfirm={checkConfirmation}
			/>
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Eye Orders</p>
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

export default ViewOrders;
