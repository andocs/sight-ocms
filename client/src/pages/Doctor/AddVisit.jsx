import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createVisitRecord, reset } from "../../features/visit/visitSlice";
import { getPatientList } from "../../features/patient/patientSlice";

import ReusableForm from "../../components/reusableform.component";
import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";
import ProceedConfirmation from "../../components/proceedconfirmation.component";
import Spinner from "../../components/spinner.component";

const header = { title: "Create Visit Record", buttontext: "Add Visit" };

const patientType = [{ type: "Walk-In" }, { type: "Registered" }];

const visitType = [
	{ type: "Appointment" },
	{ type: "First Visit" },
	{ type: "Follow-Up" },
];

function AddVisit() {
	const location = useLocation();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	const [isRejected, setRejection] = useState(false);
	const [patientData, setPatientData] = useState(null);

	function closeModal() {
		setIsOpen(false);
	}
	function closeConfirmation() {
		setIsConfirmationOpen(false);
	}

	function openModal() {
		setIsConfirmationOpen(true);
	}

	function checkConfirmation() {
		setConfirmation(true);
	}
	function checkRejection() {
		setRejection(true);
	}

	const patientDetails = location.state;
	const { newVisit, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.visit
	);
	const patientReducer = useSelector((state) => state.patient);
	const patient = patientReducer.patient;

	const formGroups = [
		{
			label: "Visit Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Patient Type *",
						type: "listbox",
						value: patientDetails?.patientType || patientType[0].type,
						options: patientType.map((type) => type.type),
						name: "patientType",
						size: "w-full",
						disabled: patientDetails?.patientType && true,
					},
					{
						label: "Visit Type *",
						type: "listbox",
						value: visitType[0].type,
						options: visitType.map((type) => type.type),
						name: "visitType",
						size: "w-full",
					},
				],
				[
					{
						label: "Reason for Visit *",
						type: "text",
						value: "",
						name: "reason",
						placeholder: "Reason for Visit",
						size: "w-full",
					},
				],
				[
					{
						label: "Medical History",
						type: "textarea",
						value: "",
						name: "medicalHistory",
						placeholder: "Relevant medical history here...",
						size: "w-full",
					},
				],
				[
					{
						label: "Additional Information",
						type: "textarea",
						value: "",
						name: "additionalInfo",
						placeholder: "Additional information here...",
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
				navigate(`/doctor/add-visit/${details._id}`, {
					state: { details, patientType: "Registered" },
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

		if (isSuccess && newVisit !== null && message !== "") {
			toast.success(message);
			openModal();
		}
		if (isConfirmed === true) {
			const details = patientDetails.details;
			navigate(`/doctor/add-record/${details._id}`, { state: { details } });
		}
		if (isRejected === true) {
			navigate("/doctor");
		}

		dispatch(reset());
	}, [
		newVisit,
		isConfirmed,
		isRejected,
		isLoading,
		isError,
		isSuccess,
		message,
		navigate,
		dispatch,
	]);

	const onSubmit = (formData) => {
		const visitData = formData;
		const patientId = patientDetails.details._id;
		dispatch(createVisitRecord({ patientId, visitData }));
	};

	if (isLoading || patientReducer.isLoading) {
		return <Spinner />;
	}

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
			{isConfirmationOpen && (
				<ProceedConfirmation
					isOpen={isConfirmationOpen}
					closeModal={closeConfirmation}
					onConfirm={checkConfirmation}
					onReject={checkRejection}
					destination={"Add Eye Records"}
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

export default AddVisit;
