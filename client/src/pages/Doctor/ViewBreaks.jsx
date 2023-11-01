import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	getBreakList,
	deleteBreak,
	reset,
	clear,
} from "../../features/schedule/scheduleSlice";
import { toast } from "react-toastify";

import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";
import Spinner from "../../components/spinner.component";
import DeleteConfirmation from "../../components/deleteconfirmation.component";

function ViewBreaks() {
	const [isViewOpen, setViewOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [breakId, setBreakId] = useState("");
	const [breakData, setBreakData] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { breaks, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.schedule
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getBreakList());
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

	function openModal(breakId) {
		setIsOpen(true);
		setBreakId(breakId);
	}

	function checkConfirmation() {
		dispatch(deleteBreak(breakId));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
	}

	const columns = [
		{ header: "Start Date", field: "startDate" },
		{ header: "End Date", field: "endDate" },
		{ header: "Reason", field: "reason" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setBreakData(details);
				setViewOpen(true);
			},
		},
		{
			label: "Update",
			handler: (details) => {
				navigate(`/doctor/edit-break/${details._id}`, { state: { details } });
			},
		},
		{
			label: "Delete",
			handler: (details) => {
				openModal(details._id);
			},
		},
	];

	function closeModal() {
		setIsOpen(false);
	}

	return (
		<>
			{isViewOpen && (
				<ViewModal
					isOpen={isViewOpen}
					closeModal={closeViewModal}
					dataFields={breakData}
					columnHeaders={columns}
					modalTitle="Doctor Break Details"
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
						<p className="font-medium text-5xl">Added Breaks</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={breaks} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewBreaks;
