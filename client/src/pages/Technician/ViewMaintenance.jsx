import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getMaintenanceList,
	deleteRequest,
	reset,
	clear,
} from "../../features/maintenance/maintenanceSlice";

import Spinner from "../../components/spinner.component";
import DeleteConfirmation from "../../components/deleteconfirmation.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewMaintenance() {
	let [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	let [isViewOpen, setViewOpen] = useState(false);
	const [requestId, setMaintenanceId] = useState("");
	const [maintenanceData, setMaintenanceData] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { maintenance, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.maintenance
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getMaintenanceList());
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

	function openModal(requestId) {
		setIsOpen(true);
		setMaintenanceId(requestId);
	}

	function checkConfirmation() {
		setConfirmation(true);
		dispatch(deleteRequest(requestId));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
	}

	const columns = [
		{ header: "Created At", field: "createdAt" },
		{ header: "Title", field: "title" },
		{ header: "Status", field: "status" },
		{ header: "Details", field: "details" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setMaintenanceData(details);
				setViewOpen(true);
			},
		},
		{
			label: "Update",
			handler: (details) => {
				navigate(`/technician/edit-request/${details._id}`, {
					state: { details },
				});
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
					dataFields={maintenanceData}
					columnHeaders={columns}
					modalTitle="View Maintenance Details"
				/>
			)}

			<DeleteConfirmation
				isOpen={isOpen}
				closeModal={closeModal}
				onConfirm={checkConfirmation}
			/>
			<div className="w-full bg-white bmaintenance-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Maintenance List</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={maintenance} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewMaintenance;
