import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getPendingRequests,
	reset,
	clear,
	editRequest,
} from "../../features/maintenance/maintenanceSlice";

import Spinner from "../../components/spinner.component";
import AcceptConfirmation from "../../components/acceptconfirmation.component";
import Table from "../../components/table.component";

function ViewPendingRequests() {
	const [isOpen, setIsOpen] = useState(false);
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
		dispatch(getPendingRequests());
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

	function openModal(requestId) {
		setIsOpen(true);
		setRequestId(requestId);
	}

	function checkConfirmation() {
		const requestData = { status: "In Progress" };
		dispatch(editRequest({ requestId, requestData }));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
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
			label: "Accept",
			handler: (details) => {
				openModal(details._id);
			},
		},
	];

	return (
		<>
			<AcceptConfirmation
				text={"Accept"}
				isOpen={isOpen}
				closeModal={closeModal}
				onConfirm={checkConfirmation}
			/>

			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Pending Requests</p>
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
					{maintenance && (
						<Table data={maintenance} columns={columns} actions={actions} />
					)}
				</div>
			</div>
		</>
	);
}

export default ViewPendingRequests;
