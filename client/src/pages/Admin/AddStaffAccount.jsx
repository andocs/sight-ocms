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

const defaultsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="#075985"
		className="w-full"
	>
		<path
			fillRule="evenodd"
			d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
			clipRule="evenodd"
		/>
	</svg>
);

const formGroups = [
	{
		label: "Personal Information",
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
	{
		label: "Account Information",
		size: "w-full",
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
			],
		],
	},
];

const imageGroup = [
	{
		label: "Profile Information",
		fields: [
			{
				label: "Image",
				type: "image",
				name: "image",
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
		placeholder: defaultsvg,
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
		if (formData.image !== "") {
			const userData = new FormData();
			userData.append("fname", formData.fname);
			userData.append("lname", formData.lname);
			userData.append("gender", formData.gender);
			userData.append("email", formData.email);
			userData.append("password", formData.password);
			userData.append("contact", formData.contact);
			userData.append("address", formData.address);
			userData.append("city", formData.city);
			userData.append("province", formData.province);
			userData.append("role", formData.role.toLowerCase());
			userData.append("image", formData.image);
			if (userData.password !== userData.conf_pass) {
				toast.error("Passwords do not match");
			} else {
				dispatch(createStaffAccount(userData));
			}
		} else {
			if (formData.role) {
				formData.role = formData.role.toLowerCase();
			}
			dispatch(createStaffAccount(formData));
		}
	};

	return (
		<>
			<ReusableForm
				header={header}
				fields={formGroups}
				onSubmit={onSubmit}
				imageGroup={imageGroup}
			/>
		</>
	);
}

export default AddStaffAccount;
