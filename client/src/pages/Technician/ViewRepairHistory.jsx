import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getRepairList,
	updateRepairRequest,
	reset,
	clear,
} from "../../features/repair/repairSlice";

import Spinner from "../../components/spinner.component";
import AcceptConfirmation from "../../components/acceptconfirmation.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewRepairHistory() {
	const [requestId, setRequestId] = useState("");
	const [requestData, setRequestData] = useState("");

	const [isViewOpen, setViewOpen] = useState(false);
	const [isCancelOpen, setCancelOpen] = useState(false);
	const [isCompleteOpen, setCompleteOpen] = useState(false);

	const dispatch = useDispatch();
	const { repair, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.repair
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getRepairList());
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
		setRequestId("");
	}

	function openCancelModal(requestId) {
		setCancelOpen(true);
		setRequestId(requestId);
	}

	function checkCancelConfirmation() {
		const requestData = { status: "Cancelled" };
		dispatch(updateRepairRequest({ requestId, requestData }));
		if (isSuccess && message) {
			toast.message(message);
		}
		setCancelOpen(false);
	}

	function closeCompletedModal() {
		setCompleteOpen(false);
		setRequestId("");
	}

	function openCompletedModal(requestId) {
		setCompleteOpen(true);
		setRequestId(requestId);
	}

	function checkCompletedConfirmation() {
		const requestData = { status: "Completed" };
		dispatch(updateRepairRequest({ requestId, requestData }));
		if (isSuccess && message) {
			toast.message(message);
		}
		setCompleteOpen(false);
	}

	function closeViewModal() {
		setViewOpen(false);
	}

	const columns = [
		{ header: "Created Time", field: "createdAt" },
		{ header: "Status", field: "status" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Item Type", field: `itemType` },
		{ header: "Amount", field: "amount" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setRequestData(details);
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
					dataFields={requestData}
					columnHeaders={columns}
					modalTitle="View Request Details"
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

			<div className="w-full bg-white bappointment-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Repair List</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					{repair && (
						<Table data={repair} columns={columns} actions={actions} />
					)}
				</div>
			</div>
		</>
	);
}

export default ViewRepairHistory;
