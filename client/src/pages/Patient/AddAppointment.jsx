import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	reset,
	scheduleAppointment,
} from "../../features/appointment/appointmentSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

const header = {
	title: "Schedule an Appointment",
	buttontext: "Add Appointment",
};

function AddAppointment() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const timeSlots = [];

	for (let hour = 9; hour <= 17; hour++) {
		for (let minute = 0; minute <= 30; minute += 30) {
			if (hour == 17) {
				break;
			} else {
				const ampm = hour < 12 ? "AM" : "PM";
				const hourFormatted = hour % 12 || 12;
				const timeSlot = `${hourFormatted.toString().padStart(2, "0")}:${minute
					.toString()
					.padStart(2, "0")} ${ampm}`;
				timeSlots.push(timeSlot);
			}
		}
	}

	const { newAppointment, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.appointment);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (isSuccess && newAppointment !== null && message !== "") {
			navigate("/patient");
			toast.success(message);
		}

		dispatch(reset());
	}, [
		newAppointment,
		isLoading,
		isError,
		isSuccess,
		message,
		navigate,
		dispatch,
	]);

	if (isLoading) {
		return <Spinner />;
	}

	const getTomorrow = () => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		return tomorrow;
	};

	const formGroups = [
		{
			label: "Appointment Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Appointment Date *",
						type: "date",
						value: getTomorrow(),
						name: "appointmentDate",
						size: "w-full",
					},
					{
						label: "Start Time *",
						type: "listbox",
						value: timeSlots[0],
						options: timeSlots,
						name: "appointmentStart",
						size: "w-full",
					},
					{
						label: "End Time *",
						type: "listbox",
						value: "",
						options: "",
						name: "appointmentEnd",
						size: "w-full",
					},
				],
			],
		},
	];

	const onSubmit = (formData) => {
		const appointmentData = formData;
		dispatch(scheduleAppointment(appointmentData));
	};
	return (
		<>
			<ReusableForm header={header} fields={formGroups} onSubmit={onSubmit} />
		</>
	);
}

export default AddAppointment;
