import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getPendingAppointments,
	editAppointment,
	reset,
	clear,
} from "../../features/appointment/appointmentSlice";

import { getScheduleList } from "../../features/schedule/scheduleSlice";

import Spinner from "../../components/spinner.component";
import AcceptConfirmation from "../../components/acceptconfirmation.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewPending() {
	let [isOpen, setIsOpen] = useState(false);
	let [isViewOpen, setViewOpen] = useState(false);
	const [appointmentId, setAppointmentId] = useState("");
	const [appointmentData, setAppointmentData] = useState("");

	const dispatch = useDispatch();
	const { appointment, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.appointment
	);

	const { schedule } = useSelector((state) => state.schedule);

	useEffect(() => {
		dispatch(getScheduleList());
	}, [dispatch]);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getPendingAppointments());

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
		setAppointmentData("");
		setAppointmentId("");
	}

	function closeViewModal() {
		setViewOpen(false);
		setAppointmentData("");
		setAppointmentId("");
	}

	function openModal(appointment) {
		setIsOpen(true);
		setAppointmentData(appointment);
		setAppointmentId(appointment._id);
	}

	function checkScheduleConflict(schedule, appointment) {
		let hasConflict = false;
		const appointmentDate = new Date(appointment.appointmentDate);

		const appointmentDayOfWeek = appointmentDate.toLocaleDateString("en-US", {
			weekday: "long",
		});

		// Find the doctor's schedule for the appointment day of the week
		const doctorSchedule = schedule.find(
			(day) => day.dayOfWeek === appointmentDayOfWeek
		);

		if (!doctorSchedule) {
			return (hasConflict = true);
		}

		const doctorStartTime = new Date("01/01/2000 " + doctorSchedule.startTime);
		const doctorEndTime = new Date("01/01/2000 " + doctorSchedule.endTime);
		const lunchBreakStart = new Date(
			"01/01/2000 " + doctorSchedule.lunchBreakStart
		);
		const lunchBreakEnd = new Date(
			"01/01/2000 " + doctorSchedule.lunchBreakEnd
		);
		const appointmentStartTime = new Date(
			"01/01/2000 " + appointment.appointmentStart
		);
		const appointmentEndTime = new Date(
			"01/01/2000 " + appointment.appointmentEnd
		);
		console.log(appointmentEndTime, lunchBreakEnd);

		if (
			appointmentStartTime < doctorStartTime ||
			appointmentEndTime > doctorEndTime ||
			(appointmentStartTime >= lunchBreakStart &&
				appointmentEndTime <= lunchBreakEnd)
		) {
			return (hasConflict = true);
		}

		return null;
	}

	function checkConfirmation() {
		const hasConflict = checkScheduleConflict(schedule, appointmentData);
		if (!hasConflict) {
			const appointmentData = { status: "Scheduled" };
			dispatch(editAppointment({ appointmentId, appointmentData }));
			if (isSuccess && message) {
				toast.message(message);
			}
		} else {
			toast.error("Can't accept due to schedule conflicts!");
		}

		setIsOpen(false);
	}

	const columns = [
		{ header: "Date", field: "appointmentDate" },
		{ header: "Status", field: "status" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Start Time", field: `appointmentStart` },
		{ header: "End Time", field: "appointmentEnd" },
		{ header: "Additional Notes", field: "notes" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setAppointmentData(details);
				setViewOpen(true);
			},
		},
		{
			label: "Accept",
			handler: (details) => {
				openModal(details);
			},
		},
	];

	return (
		<>
			{isViewOpen && (
				<ViewModal
					isOpen={isViewOpen}
					closeModal={closeViewModal}
					dataFields={appointmentData}
					columnHeaders={columns}
					modalTitle="View Order Details"
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
						<p className="font-medium text-5xl">View Pending Appointments</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					{appointment && (
						<Table data={appointment} columns={columns} actions={actions} />
					)}
				</div>
			</div>
		</>
	);
}

export default ViewPending;
