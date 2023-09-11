import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	getAppointmentDetails,
	editAppointment,
	reset,
} from "../../features/appointment/appointmentSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

function EditAppointment() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const appointmentDetails = location.state;
	const appointmentId = appointmentDetails.details._id;

	const {
		appointmentUpdate,
		newAppointment,
		isLoading,
		isError,
		isSuccess,
		message,
	} = useSelector((state) => state.appointment);

	function generateTimeOptions() {
		const options = [];
		const startTime = new Date();
		startTime.setHours(9, 0, 0, 0); // Set initial start time to 9:00 AM

		const endTime = new Date();
		endTime.setHours(17, 0, 0, 0); // Set end time to 5:00 PM

		const interval = 30 * 60 * 1000; // 30 minutes in milliseconds

		while (startTime < endTime) {
			const timeString = startTime.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
			options.push(timeString);
			startTime.setTime(startTime.getTime() + interval);
		}

		return options;
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
						value: appointmentUpdate?.date || "",
						name: "date",
						size: "w-full",
					},
					{
						label: "Start Time *",
						type: "listbox",
						value: appointmentUpdate?.startTime || generateTimeOptions()[0],
						options: generateTimeOptions(),
						name: "startTime",
						size: "w-full",
					},
					{
						label: "End Time *",
						type: "listbox",
						value: appointmentUpdate?.endTime || generateTimeOptions()[1],
						options: generateTimeOptions(),
						name: "endTime",
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

	const onSubmit = (formData) => {
		const updateInfo = {};

		const initialData = {
			date: appointmentUpdate.date,
			startTime: appointmentUpdate.startTime,
			endTime: appointmentUpdate.endTime,
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
			dispatch(editAppointment({ appointmentId, appointmentData }));
		}
	};
	return (
		<>
			<ReusableForm
				key={appointmentUpdate ? appointmentUpdate._id : "default"}
				header={{
					title: "Edit Appointment Record",
					buttontext: "Update Record",
				}}
				fields={formGroups}
				onSubmit={onSubmit}
			/>
		</>
	);
}

export default EditAppointment;
