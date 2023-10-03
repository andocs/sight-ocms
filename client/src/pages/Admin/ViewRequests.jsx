import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getMaintenanceList,
	editRequest,
	reset,
	clear,
} from "../../features/maintenance/maintenanceSlice";

import Spinner from "../../components/spinner.component";
import AcceptConfirmation from "../../components/acceptconfirmation.component";
import Table from "../../components/table.component";

function ViewRequests() {
	const [isCompleteOpen, setCompleteOpen] = useState(false);
	const [requestId, setRequestId] = useState("");
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

	function closeCompletedModal() {
		setCompleteOpen(false);
	}

	function openCompletedModal(requestId) {
		setCompleteOpen(true);
		setRequestId(requestId);
	}

	function checkCompletedConfirmation() {
		const requestData = { status: "Completed" };
		dispatch(editRequest({ requestId, requestData }));
		if (isSuccess && message) {
			toast.message(message);
		}
		setCompleteOpen(false);
	}

	const columns = [
		{ header: "Created At", field: "createdAt" },
		{ header: "Technician FName", field: "userLastName" },
		{ header: "Technician LName", field: "userFirstName" },
		{ header: "Title", field: "title" },
		{ header: "Status", field: "status" },
		{ header: "Details", field: "details" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				navigate("/admin/request-details", { state: details });
			},
		},
		{
			label: "Complete",
			handler: (details) => {
				openCompletedModal(details._id);
			},
		},
	];

	return (
		<>
			<AcceptConfirmation
				text={"Complete"}
				isOpen={isCompleteOpen}
				closeModal={closeCompletedModal}
				onConfirm={checkCompletedConfirmation}
			/>

			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Maintenance Requests</p>
					</div>
					<div>
						<button
							onClick={() => navigate("/admin")}
							className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
						>
							Back to Dashboard
						</button>
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

export default ViewRequests;
