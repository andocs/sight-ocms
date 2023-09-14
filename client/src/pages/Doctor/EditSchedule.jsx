import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	getScheduleDetails,
	editSchedule,
	reset,
	clear,
} from "../../features/schedule/scheduleSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

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

function EditSchedule() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const scheduleDetails = location.state;
	const scheduleId = scheduleDetails.details._id;

	const {
		scheduleUpdate,
		newSchedule,
		isLoading,
		isError,
		isSuccess,
		message,
	} = useSelector((state) => state.schedule);

	const formGroups = [
		{
			label: "Schedule Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Day of Week",
						type: "listbox",
						value: scheduleUpdate?.dayOfWeek || daysOfWeek[0].day,
						options: daysOfWeek.map((day) => day.day),
						name: "dayOfWeek",
						size: "w-full",
					},
					{
						label: "Start Time",
						type: "listbox",
						value: scheduleUpdate?.startTime || timeSlots[0], // Set the default value if needed
						options: timeSlots,
						name: "startTime",
						size: "w-full",
					},
					{
						label: "End Time",
						type: "listbox",
						value: scheduleUpdate?.endTime || timeSlots[1], // Set the default value if needed
						options: timeSlots,
						name: "endTime",
						size: "w-full",
					},
				],
				[
					{
						label: "Lunch Break Start",
						type: "listbox",
						value: scheduleUpdate?.lunchBreakStart || timeSlots[0], // Set the default value if needed
						options: timeSlots,
						name: "lunchBreakStart",
						size: "w-full",
					},
					{
						label: "Lunch Break End",
						type: "listbox",
						value: scheduleUpdate?.lunchBreakEnd || timeSlots[1], // Set the default value if needed
						options: timeSlots,
						name: "lunchBreakEnd",
						size: "w-full",
					},
				],
				[
					{
						label: "Set as Leave",
						type: "listbox",
						value: scheduleUpdate?.isLeave
							? "Yes"
							: scheduleUpdate?.isLeave === true
							? "Yes"
							: YesorNo[0].option,
						options: YesorNo.map((option) => option.option),
						name: "isLeave",
						size: "w-full",
					},
					{
						label: "Set as Emergency Break",
						type: "listbox",
						value: scheduleUpdate?.isEmergencyBreak
							? "Yes"
							: scheduleUpdate?.isEmergencyBreak === true
							? "Yes"
							: YesorNo[0].option,
						options: YesorNo.map((option) => option.option),
						name: "isEmergencyBreak",
						size: "w-full",
					},
				],
			],
		},
	];

	useEffect(() => {
		if (!scheduleUpdate) {
			dispatch(getScheduleDetails(scheduleDetails.details._id));
		}
	}, [dispatch, scheduleUpdate, scheduleDetails]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!scheduleDetails) {
			toast.error("No schedule selected to view.");
			navigate("/doctor");
		}

		if (isSuccess && newSchedule !== null) {
			toast.success(message);
			navigate("/doctor/view-schedule");
		}
		dispatch(reset());
	}, [newSchedule, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const onSubmit = (formData) => {
		console.log(formData);
		formData.isLeave = formData.isLeave === "No" ? false : true;
		formData.isEmergencyBreak =
			formData.isEmergencyBreak === "No" ? false : true;

		const updateInfo = {};

		const initialData = {
			dayOfWeek: scheduleUpdate.dayOfWeek,
			startTime: scheduleUpdate.startTime,
			endTime: scheduleUpdate.endTime,
			lunchBreakStart: scheduleUpdate.lunchBreakStart,
			lunchBreakEnd: scheduleUpdate.lunchBreakEnd,
			isLeave: scheduleUpdate.isLeave,
			isEmergencyBreak: scheduleUpdate.isEmergencyBreak,
		};

		for (const key in formData) {
			if (JSON.stringify(initialData[key]) !== JSON.stringify(formData[key])) {
				if (formData[key] !== "") {
					updateInfo[key] = formData[key];
				}
			}
		}

		if (JSON.stringify(updateInfo) === "{}") {
			navigate("/doctor/view-schedule");
			dispatch(reset());
		} else {
			console.log(updateInfo);
			if (updateInfo.isLeave) {
				updateInfo.isLeave = updateInfo.isLeave === "No" ? false : true;
			}
			if (updateInfo.isEmergencyBreak) {
				updateInfo.isEmergencyBreak =
					updateInfo.isEmergencyBreak === "No" ? false : true;
			}
			const scheduleData = updateInfo;
			console.log(scheduleData);
			dispatch(editSchedule({ scheduleId, scheduleData }));
		}
	};

	return (
		<>
			<ReusableForm
				key={scheduleUpdate ? scheduleUpdate._id : "default"}
				header={{
					title: "Edit Visit Record",
					buttontext: "Update Record",
				}}
				fields={formGroups}
				onSubmit={onSubmit}
			/>
		</>
	);
}

export default EditSchedule;
