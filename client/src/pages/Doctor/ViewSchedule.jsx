import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getScheduleList,
	deleteSchedule,
	reset,
	clear,
} from "../../features/schedule/scheduleSlice";

import Spinner from "../../components/spinner.component";
import DeleteConfirmation from "../../components/deleteconfirmation.component";

import ViewCards from "../../components/viewcards.component";

function ViewSchedule() {
	let [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	const [scheduleId, setScheduleId] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { schedule, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.schedule
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getScheduleList());
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
	console.log(schedule);

	function openModal(scheduleId) {
		setIsOpen(true);
		setScheduleId(scheduleId);
	}
	function checkConfirmation() {
		setConfirmation(true);
		dispatch(deleteSchedule(scheduleId));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
	}

	const header = { title: "Schedule Details", buttontext: "Back to Dashboard" };

	const columns = [
		{ header: "Day of Week", field: "dayOfWeek" },
		{ header: "Start Time", field: "startTime" },
		{ header: "End Time", field: "endTime" },
		{ header: "Lunch Break Start", field: "lunchBreakStart" },
		{ header: "Lunch Break End", field: "lunchBreakEnd" },
		{ header: "Is Leave", field: "isLeave" },
		{ header: "Is Emergency Break", field: "isEmergencyBreak" },
	];

	const handleEdit = (scheduleId) => {
		console.log(scheduleId);
		navigate(`/doctor/edit-schedule/${scheduleId}`);
	};
	const handleDelete = (scheduleId) => {
		openModal(scheduleId);
	};
	const goBack = () => {
		navigate("/doctor");
	};
	return (
		<>
			<DeleteConfirmation
				isOpen={isOpen}
				closeModal={closeModal}
				onConfirm={checkConfirmation}
			/>
			<ViewCards
				header={header}
				columns={columns}
				data={schedule}
				onClick={goBack}
				actions={{
					edit: (item) => {
						// Handle edit action for the specific item
						console.log("Edit clicked for item:", item);
					},
					delete: (item) => {
						// Handle delete action for the specific item
						console.log("Delete clicked for item:", item);
					},
				}}
			/>
		</>
	);
}

export default ViewSchedule;
