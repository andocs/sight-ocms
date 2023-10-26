import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createEyeRecord, reset } from "../../features/record/recordSlice";
import { getPatientList } from "../../features/patient/patientSlice";

import ReusableForm from "../../components/reusableform.component";
import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";
import ProceedConfirmation from "../../components/proceedconfirmation.component";
import Spinner from "../../components/spinner.component";

const header = { title: "Create Eye Record", buttontext: "Add Record" };

const interval = 0.25;

const ODSPH = [];
const ODSPHMinValue = -6.0;
const ODSPHMaxValue = 6.0;

for (let value = ODSPHMinValue; value <= ODSPHMaxValue; value += interval) {
	if (value > 0) {
		ODSPH.push({ value: `+${value.toFixed(2)}` });
	} else {
		ODSPH.push({ value: value.toFixed(2) });
	}
}

const ODCYL = [];
const ODCYLMinValue = -6.0;
const ODCYLMaxValue = 6.0;

for (let value = ODCYLMinValue; value <= ODCYLMaxValue; value += interval) {
	if (value > 0) {
		ODCYL.push({ value: `+${value.toFixed(2)}` });
	} else {
		ODCYL.push({ value: value.toFixed(2) });
	}
}

const ODAxis = [];
const ODAxisMinValue = 0;
const ODAxisMaxValue = 180;
const axisInterval = 1;

for (
	let value = ODAxisMinValue;
	value <= ODAxisMaxValue;
	value += axisInterval
) {
	ODAxis.push({ value: value.toString() });
}

const OSSPH = ODSPH;
const OSCYL = ODCYL;
const OSAxis = ODAxis;

function AddRecords() {
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
	const { newRecord, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.record
	);
	const patientReducer = useSelector((state) => state.patient);
	const patient = patientReducer.patient;

	const formGroups = [
		{
			label: "Right Eye",
			size: "w-1/2",
			fields: [
				[
					{
						label: "Sphere *",
						type: "listbox",
						value: "0.00",
						options: ODSPH.map((sphere) => sphere.value),
						name: "rightEye.sphere",
						size: "w-full",
					},
					{
						label: "Cylinder *",
						type: "listbox",
						value: "0.00",
						options: ODCYL.map((cylinder) => cylinder.value),
						name: "rightEye.cylinder",
						size: "w-full",
					},
					{
						label: "Axis *",
						type: "listbox",
						value: "0",
						options: ODAxis.map((axis) => axis.value),
						name: "rightEye.axis",
						size: "w-full",
					},
				],
			],
		},
		{
			label: "Left Eye",
			size: "w-1/2",
			fields: [
				[
					{
						label: "Sphere *",
						type: "listbox",
						value: "0.00",
						options: OSSPH.map((sphere) => sphere.value),
						name: "leftEye.sphere",
						size: "w-full",
					},
					{
						label: "Cylinder *",
						type: "listbox",
						value: "0.00",
						options: OSCYL.map((cylinder) => cylinder.value),
						name: "leftEye.cylinder",
						size: "w-full",
					},
					{
						label: "Axis *",
						type: "listbox",
						value: "0",
						options: OSAxis.map((axis) => axis.value),
						name: "leftEye.axis",
						size: "w-full",
					},
				],
			],
		},
		{
			label: "Others",
			size: "w-full",
			fields: [
				[
					{
						label: "Additional Notes",
						type: "textarea",
						value: "",
						placeholder: "Additional Notes here...",
						name: "additionalNotes",
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
				navigate(`/doctor/add-record/${details._id}`, {
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

		if (isSuccess && newRecord !== null && message !== "") {
			toast.success(message);
			openModal();
		}
		if (isConfirmed === true) {
			const details = patientDetails.details;
			navigate(`/doctor/add-order/${details._id}`, { state: { details } });
		}
		if (isRejected === true) {
			navigate("/doctor");
		}

		dispatch(reset());
	}, [
		newRecord,
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
		const recordData = formData;
		const patientId = patientDetails.details._id;
		dispatch(createEyeRecord({ patientId, recordData }));
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
					destination={"Add Order Records"}
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

export default AddRecords;
