import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getPatientList } from "../../features/patient/patientSlice";
import {
	reset,
	createAppointment,
} from "../../features/appointment/appointmentSlice";

import {
	getScheduleList,
	getAvailableDays,
} from "../../features/schedule/scheduleSlice";

import ReusableForm from "../../components/reusableform.component";
import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";
import Spinner from "../../components/spinner.component";

const header = {
	title: "Create Appointment Record",
	buttontext: "Add Appointment",
};

function AddAppointments() {
	const location = useLocation();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	let [isOpen, setIsOpen] = useState(false);
	const [patientData, setPatientData] = useState(null);
	const [daysOfWeek, setDaysOfWeek] = useState([]);

	function closeModal() {
		setIsOpen(false);
	}

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

	const patientDetails = location.state;
	let doctorSchedule = null;
	const { newAppointment, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.appointment);

	const { schedule, availableDays } = useSelector((state) => state.schedule);

	const { patient } = useSelector((state) => state.patient);

	const columns = [
		{ header: "Last Name", field: "lname" },
		{ header: "First Name", field: "fname" },
		{ header: "Email", field: "email" },
		{ header: "Contact", field: "contact" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setPatientData(details);
				setIsOpen(true);
			},
		},
		{
			label: "Confirm",
			handler: (details) => {
				navigate(`/doctor/add-appointment/${details._id}`, {
					state: { details },
				});
			},
		},
	];

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
		if (!patientDetails) {
			dispatch(getPatientList());
		}
		return () => {
			dispatch(reset());
		};
	}, [dispatch, patientDetails]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (isSuccess && newAppointment !== null && message !== "") {
			navigate("/doctor");
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

	const getLeadDate = () => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 3);
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
						disabled: daysOfWeek,
						available: schedule,
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
				[
					{
						label: "Additional Notes",
						type: "textarea",
						value: "",
						name: "notes",
						placeholder: "Additional Notes here...",
						size: "w-full",
					},
				],
			],
		},
	];

	const onSubmit = (formData) => {
		const appointmentData = formData;
		const patientId = patientDetails.details._id;
		dispatch(createAppointment({ patientId, appointmentData }));
	};
	return (
		<>
			{isOpen && (
				<ViewModal
					isOpen={isOpen}
					closeModal={closeModal}
					dataFields={patientData}
					columnHeaders={columns}
					modalTitle="Patient Details"
				/>
			)}
			<div>
				{(!location.state || !patientDetails) && patient ? (
					<>
						<div className="w-full bg-white border-b">
							<div className="p-8 flex justify-between items-center xl:w-5/6">
								<div>
									<p className="font-medium text-5xl">Registered Patients</p>
								</div>
								<div>
									<button
										onClick={() => navigate("/doctor/add-patient")}
										className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
									>
										Add Patient
									</button>
								</div>
							</div>
						</div>
						<div className="p-8">
							<div className="xl:w-5/6 flex flex-row">
								<Table data={patient} columns={columns} actions={actions} />
							</div>
						</div>
					</>
				) : (
					<>
						{availableDays && schedule && (
							<ReusableForm
								header={header}
								fields={formGroups}
								onSubmit={onSubmit}
							/>
						)}
					</>
				)}
			</div>
		</>
	);
}

export default AddAppointments;
