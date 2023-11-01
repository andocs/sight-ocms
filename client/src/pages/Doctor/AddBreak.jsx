import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { addBreak, reset } from "../../features/schedule/scheduleSlice";
import {
	getScheduledAppointments,
	getConfirmedAppointments,
} from "../../features/appointment/appointmentSlice";

import {
	getAvailableDays,
	getBreakList,
} from "../../features/schedule/scheduleSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

const reasons = [
	{ reason: "Vacation" },
	{ reason: "Holiday" },
	{ reason: "Personal Reasons" },
];

const header = { title: "Add Leave/Holiday", buttontext: "Add Break" };

function AddBreak() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [daysOfWeek, setDaysOfWeek] = useState([]);

	function checkForConflicts(
		startDate,
		endDate,
		scheduledAppointments,
		confirmedAppointments
	) {
		const breakStartDate = new Date(startDate);
		const breakEndDate = new Date(endDate);

		const normalizeDate = (date) =>
			new Date(date.getFullYear(), date.getMonth(), date.getDate());

		let hasConflict = false; // Flag to track conflicts

		// Normalize break start and end dates
		const normalizedBreakStartDate = normalizeDate(breakStartDate);
		const normalizedBreakEndDate = normalizeDate(breakEndDate);

		for (const appointment of scheduledAppointments) {
			const appointmentDate = normalizeDate(
				new Date(appointment.appointmentDate)
			);

			// Check for conflicts by examining if the appointmentDate falls within or on the break period
			if (
				(appointmentDate >= normalizedBreakStartDate &&
					appointmentDate <= normalizedBreakEndDate) ||
				appointmentDate.getTime() === normalizedBreakStartDate.getTime() ||
				appointmentDate.getTime() === normalizedBreakEndDate.getTime()
			) {
				hasConflict = true;
				break; // If a conflict is found, break the loop
			}
		}

		if (hasConflict) {
			return hasConflict; // Return if there's a conflict with scheduledAppointments
		}

		for (const appointment of confirmedAppointments) {
			const appointmentDate = normalizeDate(
				new Date(appointment.appointmentDate)
			);

			// Check for conflicts by examining if the appointmentDate falls within or on the break period
			if (
				(appointmentDate >= normalizedBreakStartDate &&
					appointmentDate <= normalizedBreakEndDate) ||
				appointmentDate.getTime() === normalizedBreakStartDate.getTime() ||
				appointmentDate.getTime() === normalizedBreakEndDate.getTime()
			) {
				hasConflict = true;
				break; // If a conflict is found, break the loop
			}
		}

		return hasConflict; // Return the final conflict status
	}

	const {
		newBreak,
		availableDays,
		breaks,
		isLoading,
		isError,
		isSuccess,
		message,
	} = useSelector((state) => state.schedule);

	const { scheduled, confirmed } = useSelector((state) => state.appointment);

	function getLeadDate(disabled, breaks) {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 3);

		const isConflict = (date) => {
			const selectedDate = new Date(date);
			selectedDate.setHours(0, 0, 0, 0);
			const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
				weekday: "long",
			});

			return (
				(disabled && disabled.includes(dayOfWeek)) ||
				(breaks &&
					breaks.some((breakItem) => {
						const breakStartDate = new Date(breakItem.startDate);
						const breakEndDate = breakItem.endDate
							? new Date(breakItem.endDate)
							: null;
						const breakStartDateString = breakStartDate.toDateString();
						return (
							(breakEndDate &&
								selectedDate >= breakStartDate &&
								selectedDate <= breakEndDate) ||
							(!breakEndDate &&
								selectedDate.toDateString() === breakStartDateString)
						);
					}))
			);
		};

		while (isConflict(tomorrow)) {
			tomorrow.setDate(tomorrow.getDate() + 1); // Move to the next day
		}
		return tomorrow;
	}

	useEffect(() => {
		dispatch(getScheduledAppointments());
		dispatch(getConfirmedAppointments());
		dispatch(getBreakList());
	}, [dispatch]);

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
				setDaysOfWeek([]);
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

		if (isSuccess && newBreak !== null && message !== "") {
			toast.success(message);
			navigate("/doctor");
		}
		dispatch(reset());
	}, [newBreak, isLoading, isError, isSuccess, message, dispatch]);

	const onSubmit = (formData) => {
		formData.startDate.setHours(0, 0, 0, 0);

		if (formData.endDate) {
			formData.endDate.setHours(0, 0, 0, 0);
			if (formData.startDate >= formData.endDate) {
				formData.endDate = null;
			}
		}

		const hasConflict = checkForConflicts(
			formData.startDate,
			formData.endDate,
			scheduled,
			confirmed
		);

		if (!hasConflict) {
			const breakData = formData;
			dispatch(addBreak(breakData));
		} else {
			toast.error("Conflict with scheduled appointment!");
		}
	};

	const formGroups = [
		{
			label: "Break Details",
			size: "w-full",
			fields: [
				[
					{
						label: "Start Date",
						type: "date",
						value: getLeadDate(daysOfWeek, breaks),
						name: "startDate",
						size: "w-full",
						disabled: daysOfWeek,
						breaks: breaks,
					},
					{
						label: "End Date",
						type: "date",
						value: getLeadDate(daysOfWeek, breaks),
						name: "endDate",
						size: "w-full",
						disabled: daysOfWeek,
						breaks: breaks,
					},
					{
						label: "Reason",
						type: "listbox",
						value: reasons[0].reason,
						options: reasons.map((reason) => reason.reason),
						name: "reason",
						size: "w-1/2",
					},
				],
			],
		},
	];

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<>
			<div>
				<ReusableForm header={header} fields={formGroups} onSubmit={onSubmit} />
			</div>
		</>
	);
}

export default AddBreak;
