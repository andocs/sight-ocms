import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getPatientList } from "../../features/patient/patientSlice";
import {
	reset,
	createAppointment,
} from "../../features/appointment/appointmentSlice";

import ReusableForm from "../../components/reusableform.component";
import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";
import ProceedConfirmation from "../../components/proceedconfirmation.component";

const header = {
	title: "Create Appointment Record",
	buttontext: "Add Appointment",
};

function AddAppointments() {
	const location = useLocation();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	let [isOpen, setIsOpen] = useState(false);
	let [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	const [isRejected, setRejection] = useState(false);
	const [patientData, setPatientData] = useState(null);

	function closeModal() {
		setIsOpen(false);
	}

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

	const patientDetails = location.state;

	const { newAppointment, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.appointment);

	const { patient } = useSelector((state) => state.patient);

	const formGroups = [
		{
			label: "Appointment Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Appointment Date *",
						type: "date",
						value: "",
						name: "date",
						size: "w-full",
					},
					{
						label: "Start Time *",
						type: "listbox",
						value: generateTimeOptions()[0],
						options: generateTimeOptions(),
						name: "startTime",
						size: "w-full",
					},
					{
						label: "End Time *",
						type: "listbox",
						value: generateTimeOptions()[1],
						options: generateTimeOptions(),
						name: "endTime",
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
					<ReusableForm
						header={header}
						fields={formGroups}
						onSubmit={onSubmit}
					/>
				)}
			</div>
		</>
	);
}

export default AddAppointments;
