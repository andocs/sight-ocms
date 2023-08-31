import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	createPatientRecord,
	reset,
} from "../../features/patient/patientSlice";
import ReusableForm from "../../components/reusableform.component";

const header = { title: "Walk In Consultation", buttontext: "Add Patient" };

const genders = [
	{ gender: "Male" },
	{ gender: "Female" },
	{ gender: "Others" },
];

const formGroups = [
	{
		label: "Patient Information",
		size: "w-full",
		fields: [
			[
				{
					label: "First Name",
					type: "text",
					value: "",
					name: "fname",
					placeholder: "First Name",
					size: "w-full",
				},
				{
					label: "Last Name",
					type: "text",
					value: "",
					name: "lname",
					placeholder: "Last Name",
					size: "w-full",
				},
				{
					label: "Gender",
					type: "listbox",
					value: genders[0].gender,
					options: genders.map((gender) => gender.gender),
					name: "gender",
					size: "w-2/5",
				},
			],
			[
				{
					label: "Email",
					type: "email",
					value: "",
					name: "email",
					placeholder: "name@email.com",
					placeholdercss: "placeholder:underline",
					size: "w-full",
				},
				{
					label: "Contact Number",
					type: "text",
					value: "",
					name: "contact",
					placeholder: "Contact Number",
					size: "w-3/5",
				},
			],
			[
				{
					label: "Address",
					type: "text",
					value: "",
					name: "address",
					placeholder: "123 Penny Lane",
					size: "w-full",
				},
				{
					label: "City",
					type: "text",
					value: "",
					name: "city",
					placeholder: "City",
					size: "w-3/5",
				},
				{
					label: "Province",
					type: "text",
					value: "",
					name: "province",
					placeholder: "Province",
					size: "w-3/5",
				},
			],
		],
	},
];

function WalkInConsult() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { newPatient, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.patient
	);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (isSuccess && newPatient !== null && message !== "") {
			toast.success(message);
			navigate("/doctor");
		}

		dispatch(reset());
	}, [newPatient, isLoading, isError, isSuccess, message, navigate, dispatch]);

	const onSubmit = (formData) => {
		const patientData = new FormData();
		patientData.append("fname", formData.fname);
		patientData.append("lname", formData.lname);
		patientData.append("gender", formData.gender);
		patientData.append("email", formData.email);
		patientData.append("contact", formData.contact);
		patientData.append("address", formData.address);
		patientData.append("city", formData.city);
		patientData.append("province", formData.province);
		dispatch(createPatientRecord(patientData));
	};

	return (
		<>
			<ReusableForm header={header} fields={formGroups} onSubmit={onSubmit} />
		</>
	);
}

export default WalkInConsult;
