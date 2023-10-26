import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	editStaffAccount,
	getStaffDetails,
	reset,
	clear,
} from "../../features/staff/staffSlice";
import Spinner from "../../components/spinner.component";
import ReusableForm from "../../components/reusableform.component";

const genders = [
	{ gender: "Male" },
	{ gender: "Female" },
	{ gender: "Others" },
];

const roles = [
	{ role: "Admin" },
	{ role: "Doctor" },
	{ role: "Technician" },
	{ role: "Staff" },
];

const header = { title: "Edit Staff Account", buttontext: "Update Account" };

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

function EditStaffAccount() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const staffDetails = location.state;
	const staffId = staffDetails.details._id;

	const { staffUpdate, newStaff, isLoading, isSuccess, isError, message } =
		useSelector((state) => state.staff);

	const formGroups = [
		{
			label: "Personal Information",
			size: "w-full",
			fields: [
				[
					{
						label: "First Name",
						type: "text",
						value: staffUpdate?.personalInfo.fname || "",
						name: "fname",
						placeholder: "First Name",
						size: "w-full",
					},
					{
						label: "Last Name",
						type: "text",
						value: staffUpdate?.personalInfo.lname || "",
						name: "lname",
						placeholder: "Last Name",
						size: "w-full",
					},
					{
						label: "Gender",
						type: "listbox",
						value: staffUpdate?.personalInfo.gender || "",
						options: genders.map((gender) => gender.gender),
						name: "gender",
						size: "w-2/5",
					},
				],
				[
					{
						label: "Email",
						type: "email",
						value: staffUpdate?.email || "",
						name: "email",
						placeholder: "name@email.com",
						placeholdercss: "placeholder:underline",
						size: "w-full",
					},
					{
						label: "Contact Number",
						type: "text",
						value: staffUpdate?.personalInfo.contact || "",
						name: "contact",
						placeholder: "Contact Number",
						size: "w-3/5",
					},
				],
				[
					{
						label: "Address",
						type: "text",
						value: staffUpdate?.personalInfo.address || "",
						name: "address",
						placeholder: "123 Penny Lane",
						size: "w-full",
					},
					{
						label: "City",
						type: "text",
						value: staffUpdate?.personalInfo.city || "",
						name: "city",
						placeholder: "City",
						size: "w-3/5",
					},
					{
						label: "Province",
						type: "text",
						value: staffUpdate?.personalInfo.province || "",
						name: "province",
						placeholder: "Province",
						size: "w-3/5",
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
					value: staffUpdate?.image || "",
					name: "image",
					size: "w-full",
				},
				{
					label: "Role",
					type: "listbox",
					value: staffUpdate?.role
						? staffUpdate.role.charAt(0).toUpperCase() +
						  staffUpdate.role.slice(1)
						: "",
					options: roles.map((role) => role.role),
					name: "role",
					size: "w-full",
				},
			],
			placeholder: defaultsvg,
		},
	];

	useEffect(() => {
		if (!staffUpdate) {
			dispatch(getStaffDetails(staffId));
		}
	}, [dispatch, staffUpdate, staffDetails]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!staffDetails) {
			toast.error("No account selected to view.");
			navigate("/admin");
		}

		if (isSuccess && newStaff !== null) {
			toast.success(message);
			navigate("/admin/view-staff");
		}
		dispatch(reset());
	}, [newStaff, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const onSubmit = (formData) => {
		const updateInfo = {};

		const initialData = {
			"personalInfo.fname": staffUpdate.personalInfo.fname,
			"personalInfo.lname": staffUpdate.personalInfo.lname,
			"personalInfo.gender": staffUpdate.personalInfo.gender,
			email: staffUpdate.email,
			"personalInfo.contact": staffUpdate.personalInfo.contact,
			"personalInfo.address": staffUpdate.personalInfo.address,
			"personalInfo.city": staffUpdate.personalInfo.city,
			"personalInfo.province": staffUpdate.personalInfo.province,
			image: staffUpdate.image !== null ? staffUpdate.image : "",
			role:
				staffUpdate.role.charAt(0).toUpperCase() + staffUpdate.role.slice(1),
		};

		for (const key in formData) {
			if (JSON.stringify(initialData[key]) !== JSON.stringify(formData[key])) {
				if (formData[key] !== "") {
					if (key === "role") {
						updateInfo[key] = formData[key].toLowerCase();
					} else {
						updateInfo[key] = formData[key];
					}
				}
			}
		}

		if (JSON.stringify(updateInfo) === "{}") {
			navigate("/admin/view-staff");
			dispatch(clear());
			dispatch(reset());
		} else {
			if (updateInfo.image) {
				const staffData = new FormData();

				for (const key in updateInfo) {
					staffData.append(key, updateInfo[key]);
				}

				dispatch(editStaffAccount({ staffId, staffData }));
			} else {
				const staffData = updateInfo;
				dispatch(editStaffAccount({ staffId, staffData }));
			}
		}
	};

	return (
		<>
			<ReusableForm
				key={staffUpdate ? staffUpdate._id : "default"}
				header={header}
				fields={formGroups}
				onSubmit={onSubmit}
				imageGroup={imageGroup}
			/>
		</>
	);
}

export default EditStaffAccount;
