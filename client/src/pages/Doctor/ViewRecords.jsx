import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
	getEyeRecords,
	deleteEyeRecord,
	reset,
	clear,
} from "../../features/record/recordSlice";

import Spinner from "../../components/spinner.component";
import DeleteConfirmation from "../../components/deleteconfirmation.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewRecords() {
	let [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	let [isViewOpen, setViewOpen] = useState(false);
	const [recordId, setRecordId] = useState("");
	const [recordData, setRecordData] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { record, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.record
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getEyeRecords());
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

	function openModal(recordId) {
		setIsOpen(true);
		setRecordId(recordId);
	}

	function checkConfirmation() {
		setConfirmation(true);
		dispatch(deleteEyeRecord(recordId));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
	}

	const columns = [
		{ header: "Record Date", field: "createdAt" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "OD SPH", field: `rightEye.sphere` },
		{ header: "OD CYL", field: "rightEye.cylinder" },
		{ header: "OD Axis", field: "rightEye.axis" },
		{ header: "OS SPH", field: "leftEye.sphere" },
		{ header: "OS CYL", field: "leftEye.cylinder" },
		{ header: "OS Axis", field: "leftEye.axis" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setRecordData(details);
				console.log(details);
				setViewOpen(true);
			},
		},
		{
			label: "Update",
			handler: (details) => {
				navigate(`/doctor/edit-record/${details._id}`, { state: { details } });
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
					dataFields={recordData}
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
						<p className="font-medium text-5xl">Eye Records</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={record} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewRecords;
