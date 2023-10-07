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

import { getScheduledAppointments } from "../../features/appointment/appointmentSlice";

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

	const { appointment } = useSelector((state) => state.appointment);

	useEffect(() => {
		if (!appointment) {
			dispatch(getScheduledAppointments());
		}
	}, [dispatch, appointment]);

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

	const goBack = () => {
		navigate("/doctor");
	};

	function checkForConflicts(scheduleDetails, scheduledAppointments) {
		const scheduleDayOfWeek = scheduleDetails.dayOfWeek;
		const currentDate = new Date(); // Get the current date

		let hasConflict = false; // Flag to track conflicts

		// Loop through pending appointments
		for (const appointment of scheduledAppointments) {
			const appointmentDate = new Date(appointment.appointmentDate);
			const appointmentDayOfWeek = appointmentDate.toLocaleDateString("en-US", {
				weekday: "long",
			});

			if (
				scheduleDayOfWeek === appointmentDayOfWeek &&
				appointmentDate >= currentDate
			) {
				return (hasConflict = true);
			}
		}
	}

	const actions = [
		{
			label: "Edit",
			handler: (details) => {
				const hasConflict = checkForConflicts(details, appointment);
				if (!hasConflict) {
					navigate(`/doctor/edit-schedule/${details._id}`, {
						state: { details },
					});
				} else {
					toast.error("Conflict with scheduled appointment!");
				}
			},
		},
		{
			label: "Delete",
			css: "red",
			handler: (details) => {
				const hasConflict = checkForConflicts(details, appointment);
				if (!hasConflict) {
					openModal(details._id);
				} else {
					toast.error("Conflict with scheduled appointment!");
				}
			},
		},
	];
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
				actions={actions}
			/>
		</>
	);
}

export default ViewSchedule;
