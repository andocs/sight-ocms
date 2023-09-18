import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	getAppointmentDetails,
	editAppointment,
	reset,
} from "../../features/appointment/appointmentSlice";
import {
	getScheduleList,
	getAvailableDays,
} from "../../features/schedule/scheduleSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

function EditAppointment() {
	const [daysOfWeek, setDaysOfWeek] = useState([]);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const appointmentDetails = location.state;
	const appointmentId = appointmentDetails.details._id;
	let doctorSchedule = null;
	const {
		appointmentUpdate,
		newAppointment,
		isLoading,
		isError,
		isSuccess,
		message,
	} = useSelector((state) => state.appointment);

	const { schedule, availableDays } = useSelector((state) => state.schedule);

	useEffect(() => {
		if (!doctorSchedule) {
			dispatch(getScheduleList());
		}
	}, [dispatch, doctorSchedule]);

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
		if (!appointmentUpdate) {
			dispatch(getAppointmentDetails(appointmentDetails.details._id));
		}
	}, [dispatch, appointmentUpdate, appointmentDetails]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!appointmentDetails) {
			toast.error("No appointment selected to view.");
			navigate("/doctor");
		}

		if (isSuccess && newAppointment !== null) {
			toast.success(message);
			navigate("/doctor/view-appointments");
		}
		dispatch(reset());
	}, [newAppointment, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const formGroups = [
		{
			label: "Appointment Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Appointment Date *",
						type: "date",
						value: appointmentUpdate?.appointmentDate
							? new Date(appointmentUpdate?.appointmentDate)
							: "",
						name: "appointmentDate",
						size: "w-full",
						disabled: daysOfWeek,
						available: schedule,
					},
					{
						label: "Start Time *",
						type: "listbox",
						value: appointmentUpdate?.appointmentStart || "",
						options: "",
						name: "appointmentStart",
						size: "w-full",
					},
					{
						label: "End Time *",
						type: "listbox",
						value: appointmentUpdate?.appointmentEnd || "",
						options: "",
						name: "appointmentEnd",
						size: "w-full",
					},
				],
				[
					{
						label: "Additional Notes",
						type: "textarea",
						value: appointmentUpdate?.notes || "",
						name: "notes",
						placeholder: "Additional Notes here...",
						size: "w-full",
					},
				],
			],
		},
	];

	const onSubmit = (formData) => {
		const updateInfo = {};

		const initialData = {
			appointmentDate: appointmentUpdate.appointmentDate,
			appointmentStart: appointmentUpdate.appointmentStart,
			appointmentEnd: appointmentUpdate.appointmentEnd,
			notes: appointmentUpdate.notes,
		};
		for (const key in initialData) {
			if (JSON.stringify(initialData[key]) !== JSON.stringify(formData[key])) {
				if (formData[key] !== "") {
					if (formData[key] === undefined) {
						updateInfo[key] = [];
					} else {
						updateInfo[key] = formData[key];
					}
				}
			}
		}
		if (JSON.stringify(updateInfo) === "{}") {
			navigate("/doctor/view-appointments");
			dispatch(reset());
		} else {
			const appointmentData = updateInfo;
			console.log(appointmentData);
			dispatch(editAppointment({ appointmentId, appointmentData }));
		}
	};
	return (
		<>
			{daysOfWeek && schedule && (
				<ReusableForm
					key={appointmentUpdate}
					header={{
						title: "Edit Appointment Record",
						buttontext: "Update Record",
					}}
					fields={formGroups}
					onSubmit={onSubmit}
				/>
			)}
		</>
	);
}

export default EditAppointment;
