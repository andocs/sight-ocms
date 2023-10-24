import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	reset,
	scheduleAppointment,
} from "../../features/appointment/appointmentSlice";

import { getScheduleList } from "../../features/schedule/scheduleSlice";

import ReusableForm from "../../components/reusableform.component";
import DoctorCards from "../../components/doctorcards.component";
import Spinner from "../../components/spinner.component";

const header = {
	title: "Schedule an Appointment",
	buttontext: "Add Appointment",
};

function AddAppointment() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const doctorDetails = location.state;
	const [daysOfWeek, setDaysOfWeek] = useState(null);
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

	const scheduleReducer = useSelector((state) => state.schedule);

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

	useEffect(() => {
		dispatch(getScheduleList());
	}, []);

	useEffect(() => {
		if (doctorDetails && doctorDetails.details.schedule) {
			const availableDays = [];
			for (const day of doctorDetails.details.schedule) {
				availableDays.push(day.dayOfWeek);
			}
			const allDays = [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			];

			const days = allDays.filter((day) => !availableDays.includes(day));
			if (days.length === 0) {
				setDaysOfWeek([]);
			} else {
				setDaysOfWeek(days);
			}
		}
	}, [doctorDetails]);

	if (isLoading || scheduleReducer.isLoading) {
		return <Spinner />;
	}

	const getLeadDate = () => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 3);
		if (daysOfWeek) {
			daysOfWeek.filter((day) => {
				const longDay = tomorrow.toLocaleDateString("en-US", {
					weekday: "long",
				});
				while (day.includes(longDay)) {
					tomorrow.setDate(today.getDate() + 1);
				}
			});
		}

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
						value: getLeadDate(),
						name: "appointmentDate",
						size: "w-full",
						disabled: daysOfWeek && daysOfWeek,
						available: doctorDetails?.details && doctorDetails.details.schedule,
						appointment:
							doctorDetails?.details && doctorDetails.details.appointments,
					},
					{
						label: "Start Time *",
						type: "listbox",
						value: "",
						options: "",
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

	const onHeaderClick = () => {
		navigate(`/patient/add-appointment`, {
			state: { details: "" },
		});
	};

	const onClick = (details) => {
		console.log(details);
		navigate(`/patient/add-appointment/${details.id}`, {
			state: { details },
		});
	};

	const onSubmit = (formData) => {
		const appointmentData = formData;
		if (doctorDetails.details && doctorDetails.details !== "") {
			appointmentData.doctor = doctorDetails.details.id;
		}
		dispatch(scheduleAppointment(appointmentData));
	};
	return (
		<>
			{(!location.state || !doctorDetails) && scheduleReducer.schedule ? (
				<>
					<div className="w-full bg-white border-b">
						<div className="p-8 flex justify-between items-center xl:w-5/6">
							<div>
								<p className="font-medium text-5xl">
									Choose Your Preferred Doctor
								</p>
							</div>
							<div>
								<button
									onClick={onHeaderClick}
									className="min-w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
								>
									Proceed without Doctor
								</button>
							</div>
						</div>
					</div>
					<div className="p-8">
						<div className="xl:w-5/6 flex flex-row">
							{scheduleReducer.schedule.map((doctor) => (
								<DoctorCards
									key={doctor.name}
									props={doctor}
									onClick={(doctor) => onClick(doctor)}
								/>
							))}
						</div>
					</div>
				</>
			) : (
				<ReusableForm
					key={doctorDetails}
					header={header}
					fields={formGroups}
					onSubmit={onSubmit}
				/>
			)}
		</>
	);
}

export default AddAppointment;
