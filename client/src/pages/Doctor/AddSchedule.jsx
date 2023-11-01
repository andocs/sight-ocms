import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	createSchedule,
	getAvailableDays,
	reset,
} from "../../features/schedule/scheduleSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

function AddSchedule() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { newSchedule, availableDays, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.schedule);

	const header = { title: "Add Doctor Schedule", buttontext: "Add Schedule" };

	const YesorNo = [{ option: "No" }, { option: "Yes" }];

	const timeSlots = [];

	const [daysOfWeek, setDaysOfWeek] = useState([]);

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

	useEffect(() => {
		const allDays = [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		];
		if (!availableDays) {
			dispatch(getAvailableDays());
		} else if (Object.keys(availableDays).length === 0) {
			setDaysOfWeek(allDays);
		} else {
			const days = allDays.filter((day) => !availableDays.includes(day));
			if (days.length === 0) {
				navigate("/doctor");
				toast.info("You have already added a full schedule!");
			} else {
				setDaysOfWeek(days);
			}
		}
	}, [availableDays]);

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

	if (isLoading) {
		return <Spinner />;
	}

	const onSubmit = (formData) => {
		if (formData["startTime"] === "N/A" || formData["endTime"] === "N/A") {
			toast.error("Fields cannot be blank!");
		} else {
			console.log(formData);
			console.log("hehe");
			dispatch(createSchedule(formData));
		}
	};

	const formGroups = [
		{
			label: "Schedule Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Day of Week",
						type: "listbox",
						value: daysOfWeek[0],
						options: daysOfWeek,
						name: "dayOfWeek",
						size: "w-full",
					},
					{
						label: "Start Time",
						type: "listbox",
						value: timeSlots[0],
						options: timeSlots.slice(0, timeSlots.indexOf("5:00 PM") - 5),
						name: "startTime",
						size: "w-full",
					},
					{
						label: "End Time",
						type: "listbox",
						value: "",
						options: "",
						name: "endTime",
						size: "w-full",
					},
				],
				[
					{
						label: "Lunch Break Start",
						type: "listbox",
						value: "",
						options: "",
						name: "lunchBreakStart",
						size: "w-full",
					},
					{
						label: "Lunch Break End",
						type: "listbox",
						value: "",
						options: "",
						name: "lunchBreakEnd",
						size: "w-full",
					},
				],
			],
		},
	];

	return (
		<>
			{daysOfWeek && daysOfWeek.length > 0 && (
				<ReusableForm header={header} fields={formGroups} onSubmit={onSubmit} />
			)}
		</>
	);
}

export default AddSchedule;
