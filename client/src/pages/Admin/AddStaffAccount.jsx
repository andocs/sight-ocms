import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createStaffAccount, reset } from "../../features/staff/staffSlice";
import ReusableForm from "../../components/reusableform.component";

const genders = [
	{ gender: "Male" },
	{ gender: "Female" },
	{ gender: "Others" },
];

const roles = [{ role: "Admin" }, { role: "Doctor" }, { role: "Technician" }];

const header = { title: "Add Staff Account", buttontext: "Create Account" };

const formGroups = [
	{
		label: "Personal Information",
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
	{
		label: "Account Information",
		fields: [
			[
				{
					label: "Password",
					type: "password",
					value: "",
					name: "password",
					placeholder: "••••••••",
					size: "w-full",
				},
				{
					label: "Confirm Password",
					type: "password",
					value: "",
					name: "conf_pass",
					placeholder: "••••••••",
					size: "w-full",
				},
				{
					label: "Role",
					type: "listbox",
					value: roles[0].role,
					options: roles.map((role) => role.role),
					name: "role",
					size: "w-full",
				},
			],
		],
	},
];

function AddStaffAccount() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { newStaff, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.staff
	);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (isSuccess && newStaff !== null && message !== "") {
			toast.success(message);
			navigate("/admin");
		}

		dispatch(reset());
	}, [newStaff, isLoading, isError, isSuccess, message, navigate, dispatch]);

	const onSubmit = (formData) => {
		const userData = {
			fname: formData.fname,
			lname: formData.lname,
			gender: formData.gender,
			email: formData.email,
			password: formData.password,
			conf_pass: formData.conf_pass,
			contact: formData.contact,
			address: formData.address,
			city: formData.city,
			province: formData.province,
			role: formData.role.toLowerCase(),
		};

		if (userData.password !== userData.conf_pass) {
			toast.error("Passwords do not match");
		} else {
			dispatch(createStaffAccount(userData));
		}
	};

	return (
		<>
			<ReusableForm header={header} fields={formGroups} onSubmit={onSubmit} />
		</>
	);
}

export default AddStaffAccount;
