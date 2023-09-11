import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createSchedule, reset } from "../../features/schedule/scheduleSlice";

import ReusableForm from "../../components/reusableform.component";

const header = { title: "Add Doctor Schedule", buttontext: "Add Schedule" };

const daysOfWeek = [
	{ day: "Monday" },
	{ day: "Tuesday" },
	{ day: "Wednesday" },
	{ day: "Thursday" },
	{ day: "Friday" },
	{ day: "Saturday" },
	{ day: "Sunday" },
];

const YesorNo = [{ option: "No" }, { option: "Yes" }];

const timeSlots = [];

for (let hour = 9; hour <= 17; hour++) {
	for (let minute = 0; minute <= 30; minute += 30) {
		if (hour == 17 && minute == 30) {
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

const formGroups = [
	{
		label: "Schedule Information",
		size: "w-full",
		fields: [
			[
				{
					label: "Day of Week",
					type: "listbox",
					value: daysOfWeek[0].day,
					options: daysOfWeek.map((day) => day.day),
					name: "dayOfWeek",
					size: "w-full",
				},
				{
					label: "Start Time",
					type: "listbox",
					value: timeSlots[0], // Set the default value if needed
					options: timeSlots,
					name: "startTime",
					size: "w-full",
				},
				{
					label: "End Time",
					type: "listbox",
					value: timeSlots[1], // Set the default value if needed
					options: timeSlots,
					name: "endTime",
					size: "w-full",
				},
			],
			[
				{
					label: "Lunch Break Start",
					type: "listbox",
					value: timeSlots[0], // Set the default value if needed
					options: timeSlots,
					name: "lunchBreakStart",
					size: "w-full",
				},
				{
					label: "Lunch Break End",
					type: "listbox",
					value: timeSlots[1], // Set the default value if needed
					options: timeSlots,
					name: "lunchBreakEnd",
					size: "w-full",
				},
			],
			[
				{
					label: "Set as Leave",
					type: "listbox",
					value: YesorNo[0].option, // Set the default value if needed
					options: YesorNo.map((option) => option.option),
					name: "isLeave",
					size: "w-full",
				},
				{
					label: "Set as Emergency Break",
					type: "listbox",
					value: YesorNo[0].option, // Set the default value if needed
					options: YesorNo.map((option) => option.option),
					name: "isEmergencyBreak",
					size: "w-full",
				},
			],
		],
	},
];

function AddSchedule() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { newSchedule, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.schedule
	);
	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (isSuccess && newSchedule !== null && message !== "") {
			toast.success(message);
			navigate("/doctor/view-schedule/");
		}

		dispatch(reset());
	}, [newSchedule, isLoading, isError, isSuccess, message, navigate, dispatch]);

	const onSubmit = (formData) => {
		dispatch(createSchedule(formData));
	};
	return (
		<>
			<ReusableForm header={header} fields={formGroups} onSubmit={onSubmit} />
		</>
	);
}

export default AddSchedule;
