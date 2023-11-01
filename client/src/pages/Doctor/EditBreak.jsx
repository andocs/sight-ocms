import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	getAvailableDays,
	getBreakList,
	updateBreak,
	reset,
	getBreakDetails,
} from "../../features/schedule/scheduleSlice";

import {
	getConfirmedAppointments,
	getScheduledAppointments,
} from "../../features/appointment/appointmentSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

const reasons = [
	{ reason: "Vacation" },
	{ reason: "Holiday" },
	{ reason: "Personal Reasons" },
];

function EditBreak() {
	const [daysOfWeek, setDaysOfWeek] = useState([]);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const breakDetails = location.state;
	const breakId = breakDetails?.details._id;

	const {
		schedule,
		availableDays,
		breaks,
		breakUpdate,
		newBreak,
		isLoading,
		isError,
		isSuccess,
		message,
	} = useSelector((state) => state.schedule);

	const { confirmed, scheduled } = useSelector((state) => state.appointment);

	useEffect(() => {
		dispatch(getScheduledAppointments());
		dispatch(getConfirmedAppointments());
	}, [dispatch]);

	useEffect(() => {
		dispatch(getBreakList());
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
				setDaysOfWeek([]);
			} else {
				setDaysOfWeek(days);
			}
		}
	}, [dispatch, availableDays]);

	useEffect(() => {
		if (!breakUpdate && breakDetails) {
			dispatch(getBreakDetails(breakId));
		}
	}, [dispatch, breakUpdate]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!breakDetails) {
			toast.error("No break selected to view.");
			navigate("/doctor");
		}

		if (isSuccess && newBreak !== null) {
			toast.success(message);
			navigate("/doctor/view-breaks");
		}
		dispatch(reset());
	}, [newBreak, breakDetails, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	function checkForConflicts(
		breakStartDate,
		breakEndDate,
		scheduledAppointments,
		confirmedAppointments
	) {
		const currentDate = new Date();
		let hasConflict = false;

		for (const appointment of scheduledAppointments) {
			const appointmentDate = new Date(appointment.appointmentDate);
			appointmentDate.setHours(0, 0, 0, 0);
			const appointmentDayOfWeek = appointmentDate.toLocaleDateString("en-US", {
				weekday: "long",
			});

			if (
				(breakStartDate <= appointmentDate &&
					breakEndDate >= appointmentDate &&
					appointmentDate >= currentDate) ||
				appointmentDayOfWeek ===
					breakStartDate.toLocaleDateString("en-US", {
						weekday: "long",
					})
			) {
				return true;
			}
		}

		for (const appointment of confirmedAppointments) {
			const appointmentDate = new Date(appointment.appointmentDate);
			appointmentDate.setHours(0, 0, 0, 0);
			const appointmentDayOfWeek = appointmentDate.toLocaleDateString("en-US", {
				weekday: "long",
			});

			if (
				(breakStartDate <= appointmentDate &&
					breakEndDate >= appointmentDate &&
					appointmentDate >= currentDate) ||
				appointmentDayOfWeek ===
					breakStartDate.toLocaleDateString("en-US", {
						weekday: "long",
					})
			) {
				return true;
			}
		}

		return hasConflict;
	}

	const formGroups = [
		{
			label: "Break Details",
			size: "w-full",
			fields: [
				[
					{
						label: "Start Date",
						type: "date",
						value: breakUpdate?.startDate
							? new Date(breakUpdate?.startDate)
							: "",
						name: "startDate",
						size: "w-full",
						disabled: daysOfWeek,
						breaks: breaks,
						start: breakUpdate?.startDate
							? new Date(breakUpdate?.startDate)
							: null,
						end: breakUpdate?.endDate ? new Date(breakUpdate?.endDate) : null,
					},
					{
						label: "End Date",
						type: "date",
						value: breakUpdate?.endDate ? new Date(breakUpdate?.endDate) : "",
						name: "endDate",
						size: "w-full",
						disabled: daysOfWeek,
						breaks: breaks,
						start: breakUpdate?.startDate
							? new Date(breakUpdate?.startDate)
							: null,
						end: breakUpdate?.endDate ? new Date(breakUpdate?.endDate) : null,
					},
					{
						label: "Reason",
						type: "listbox",
						value: breakUpdate?.reasons || reasons[0].reason,
						options: reasons.map((reason) => reason.reason),
						name: "reason",
						size: "w-1/2",
					},
				],
			],
		},
	];

	const onSubmit = (formData) => {
		const startDate = new Date(formData.startDate);
		startDate.setHours(0, 0, 0, 0);
		const endDate =
			formData.endDate && formData.startDate !== formData.endDate
				? formData.endDate
				: null;
		endDate && endDate.setHours(0, 0, 0, 0);
		if (startDate.toDateString() === endDate.toDateString()) {
			formData.endDate = null;
		}
		console.log(startDate, endDate, startDate === endDate);
		const hasConflict = checkForConflicts(
			startDate,
			endDate,
			scheduled,
			confirmed
		);
		if (!hasConflict) {
			const updateInfo = {};

			const initialData = {
				startDate: breakUpdate.startDate,
				endDate: breakUpdate.endDate,
				reason: breakUpdate.reason,
			};
			for (const key in initialData) {
				if (
					JSON.stringify(initialData[key]) !== JSON.stringify(formData[key])
				) {
					if (formData[key] !== "") {
						updateInfo[key] = formData[key];
					}
				}
			}
			console.log(initialData, updateInfo);

			if (JSON.stringify(updateInfo) === "{}") {
				navigate("/doctor/view-breaks");
				dispatch(reset());
			} else {
				if (updateInfo.endDate) {
					if (updateInfo.startDate === updateInfo.endDate) {
						updateInfo.endDate = null;
					}
				}
				const breakData = updateInfo;
				dispatch(updateBreak({ breakId, breakData }));
			}
		} else {
			toast.error("Conflict with scheduled appointment!");
		}
	};

	return (
		<>
			<ReusableForm
				key={breakUpdate ? breakUpdate._id : "default"}
				header={{
					title: "Edit Break Record",
					buttontext: "Update Break",
				}}
				fields={formGroups}
				onSubmit={onSubmit}
			/>
		</>
	);
}

export default EditBreak;
