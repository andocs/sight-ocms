import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	getVisitDetails,
	editVisitRecord,
	reset,
	clear,
} from "../../features/visit/visitSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

const patientType = [{ type: "Walk-In" }, { type: "Registered" }];

const visitType = [
	{ type: "Appointment" },
	{ type: "First Visit" },
	{ type: "Follow-Up" },
];

function EditVisit() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const visitDetails = location.state;
	const visitId = visitDetails.details._id;

	const { visitUpdate, newVisit, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.visit);

	const formGroups = [
		{
			label: "Visit Information",
			fields: [
				[
					{
						label: "Patient Type *",
						type: "listbox",
						value: visitUpdate?.patientType || patientType[0].type,
						options: patientType.map((type) => type.type),
						name: "patientType",
						size: "w-full",
					},
					{
						label: "Visit Type *",
						type: "listbox",
						value: visitUpdate?.visitType || visitType[0].type,
						options: visitType.map((type) => type.type),
						name: "visitType",
						size: "w-full",
					},
				],
				[
					{
						label: "Reason for Visit *",
						type: "text",
						value: visitUpdate?.reason || "",
						name: "reason",
						placeholder: "Reason for Visit",
						size: "w-full",
					},
				],
				[
					{
						label: "Medical History",
						type: "textarea",
						value: visitUpdate?.medicalHistory || "",
						name: "medicalHistory",
						placeholder: "Relevant medical history here...",
						size: "w-full",
					},
				],
				[
					{
						label: "Additional Information",
						type: "textarea",
						value: visitUpdate?.additionalInfo || "",
						name: "additionalInfo",
						placeholder: "Additional information here...",
						size: "w-full",
					},
				],
			],
		},
	];

	useEffect(() => {
		if (!visitUpdate) {
			dispatch(getVisitDetails(visitDetails.details._id));
		}
	}, [dispatch, visitUpdate, visitDetails]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!visitDetails) {
			toast.error("No visit selected to view.");
			navigate("/doctor");
		}

		if (isSuccess && newVisit !== null) {
			toast.success(message);
			navigate("/doctor/view-visit");
		}
		dispatch(reset());
	}, [newVisit, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const onSubmit = (formData) => {
		const visitData = formData;
		dispatch(editVisitRecord({ visitId, visitData }));
	};

	return (
		<>
			<ReusableForm
				key={visitUpdate ? visitUpdate._id : "default"}
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

export default EditVisit;
