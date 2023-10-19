import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getPendingRepairs,
	updateRepairRequest,
	reset,
	clear,
} from "../../features/repair/repairSlice";

import Spinner from "../../components/spinner.component";
import AcceptConfirmation from "../../components/acceptconfirmation.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewPendingTech() {
	const [isOpen, setIsOpen] = useState(false);
	const [isViewOpen, setViewOpen] = useState(false);
	const [requestId, setRequestId] = useState("");
	const [requestData, setRequestData] = useState("");

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
		dispatch(getPendingRepairs());
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
		setRequestId("");
	}

	function openModal(requestId) {
		setIsOpen(true);
		setRequestId(requestId);
	}

	function checkConfirmation() {
		const requestData = { status: "In Progress" };
		dispatch(updateRepairRequest({ requestId, requestData }));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
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
					dataFields={requestData}
					columnHeaders={columns}
					modalTitle="View Request Details"
				/>
			)}

			<AcceptConfirmation
				text={"Accept"}
				isOpen={isOpen}
				closeModal={closeModal}
				onConfirm={checkConfirmation}
			/>

			<div className="w-full bg-white bappointment-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">View Pending Repairs</p>
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

export default ViewPendingTech;
