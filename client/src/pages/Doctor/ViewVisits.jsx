import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
	getVisitList,
	deleteVisitRecord,
	reset,
	clear,
} from "../../features/visit/visitSlice";
import Spinner from "../../components/spinner.component";
import DeleteConfirmation from "../../components/deleteconfirmation.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewVisits() {
	let [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	let [isViewOpen, setViewOpen] = useState(false);
	const [visitId, setVisitId] = useState("");
	const [visitData, setVisitData] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { visit, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.visit
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getVisitList());
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

	function openModal(visitId) {
		setIsOpen(true);
		setVisitId(visitId);
	}

	function checkConfirmation() {
		setConfirmation(true);
		dispatch(deleteVisitRecord(visitId));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
	}

	const columns = [
		{ header: "Visit Date", field: "visitDate" },
		{ header: "Patient Type", field: "patientType" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Visit Type", field: "visitType" },
		{ header: "Reason", field: "reason" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setVisitData(details);
				setViewOpen(true);
			},
		},
		{
			label: "Update",
			handler: (details) => {
				navigate(`/doctor/edit-visit/${details._id}`, { state: { details } });
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
					dataFields={visitData}
					columnHeaders={columns}
					modalTitle="Visit Record Details"
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
						<p className="font-medium text-5xl">Visit Records</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={visit} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewVisits;
