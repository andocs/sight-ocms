import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Spinner from "../../components/spinner.component";
import UserProfile from "../../components/userprofile.component";

import {
	getUser,
	updateProfile,
	reset,
	clear,
	changePassword,
} from "../../features/auth/authSlice";

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

const genders = [
	{ gender: "Male" },
	{ gender: "Female" },
	{ gender: "Others" },
];

function Profile() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const errors = [];
	let pushed = 0;

	const token = localStorage.getItem("user");

	useEffect(() => {
		if (!token) {
			navigate("/login");
			errors.push("Unauthorized Access!");
			if (errors.length > 0 && pushed < 1) {
				toast.error("Unauthorized Access!");
				pushed++;
			}
		}
	}, []);

	const { info, newInfo, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.auth
	);

	useEffect(() => {
		if (!info) {
			dispatch(getUser());
		}
	}, [dispatch, info]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (isSuccess && newInfo !== null) {
			toast.success(message);
			navigate("/profile");
			dispatch(clear());
		}
		return () => {
			dispatch(reset());
		};
	}, [newInfo, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading || !info) {
		return <Spinner />;
	}

	const formGroups = [
		{
			label: "Personal Information",
			size: "w-full",
			fields: [
				[
					{
						label: "First Name",
						type: "text",
						value: info?.personalInfo?.fname || "",
						name: "fname",
						placeholder: "First Name",
						size: "w-full",
					},
				],
				[
					{
						label: "Last Name",
						type: "text",
						value: info?.personalInfo?.lname || "",
						name: "lname",
						placeholder: "Last Name",
						size: "w-full",
					},
				],
				[
					{
						label: "Gender",
						type: "listbox",
						value: info?.personalInfo?.gender || genders[0].gender,
						options: genders.map((gender) => gender.gender),
						name: "gender",
						size: "w-full",
					},
				],
				[
					{
						label: "Email",
						type: "email",
						value: info?.email || "",
						name: "email",
						placeholder: "name@email.com",
						placeholdercss: "placeholder:underline",
						size: "w-full",
					},
				],
				[
					{
						label: "Contact Number",
						type: "text",
						value: info?.personalInfo?.contact || "",
						name: "contact",
						placeholder: "Contact Number",
						size: "w-full",
					},
				],
				[
					{
						label: "Address",
						type: "text",
						value: info?.personalInfo?.address || "",
						name: "address",
						placeholder: "123 Penny Lane",
						size: "w-full",
					},
				],
				[
					{
						label: "City",
						type: "text",
						value: info?.personalInfo?.city || "",
						name: "city",
						placeholder: "City",
						size: "w-full",
					},
				],
				[
					{
						label: "Province",
						type: "text",
						value: info?.personalInfo?.province || "",
						name: "province",
						placeholder: "Province",
						size: "w-full",
					},
				],
			],
		},
	];

	const imageGroup = [
		{
			fields: [
				{
					label: "Image",
					type: "image",
					value: info?.image || "",
					name: "image",
					size: "w-full",
				},
			],
			fname: info?.personalInfo?.fname
				? info?.personalInfo?.fname
				: info?.personalInfo?.gender === "Female"
				? "Jane"
				: "John",
			lname: info?.personalInfo?.lname || "Doe",
			email: info?.email || "placeholder@email.com",
			role: info?.role
				? info.role.charAt(0).toUpperCase() + info.role.slice(1)
				: "Patient",
			placeholder: defaultsvg,
		},
	];

	const passwordGroup = [
		{
			label: "Account Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Retype Old Password",
						type: "password",
						value: "",
						name: "oldPassword",
						size: "w-full",
					},
				],
				[
					{
						label: "New Password",
						type: "password",
						value: "",
						name: "newPassword",
						size: "w-full",
					},
				],
				[
					{
						label: "Confirm New Password",
						type: "password",
						value: "",
						name: "confPassword",
						size: "w-full",
					},
				],
			],
		},
	];

	const onSubmit = (formData) => {
		const updateInfo = {};

		const initialData = {
			fname: info?.personalInfo?.fname || "",
			lname: info?.personalInfo?.lname || "",
			gender: info?.personalInfo?.gender || genders[0].gender,
			email: info?.email,
			contact: info?.personalInfo?.contact || "",
			address: info?.personalInfo?.address || "",
			city: info?.personalInfo?.city || "",
			province: info?.personalInfo?.province || "",
			image: info?.image !== null ? info?.image : "",
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
			navigate("/");
			dispatch(clear());
			dispatch(reset());
		} else {
			const newInfo = {};
			const personalInfo = {
				fname: "",
				lname: "",
				gender: "",
				contact: "",
				address: "",
				city: "",
				province: "",
			};
			for (const key in personalInfo) {
				if (updateInfo.hasOwnProperty(key)) {
					newInfo[key] = updateInfo[key];
				}
			}
			if (updateInfo.image) {
				const infoData = new FormData();

				for (const key in newInfo) {
					infoData.append(`personalInfo.${key}`, newInfo[key]);
				}
				for (const key in updateInfo) {
					if (!personalInfo.hasOwnProperty(key)) {
						infoData.append(key, updateInfo[key]);
					}
				}

				dispatch(updateProfile(infoData));
			} else {
				let infoData = {};
				for (const key in updateInfo) {
					if (!personalInfo.hasOwnProperty(key)) {
						infoData[key] = updateInfo[key];
					} else {
						infoData[`personalInfo.${key}`] = newInfo[key];
					}
				}
				dispatch(updateProfile(infoData));
			}
		}
	};

	const onPasswordSubmit = (passwordFormData) => {
		dispatch(changePassword(passwordFormData));
	};

	return (
		<div className="bg-slate-50 overflow-auto">
			{/* Title with Button */}
			<div className="w-full bg-white border-b">
				<div className="px-14 py-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">User Profile</p>
					</div>
				</div>
			</div>
			{info && (
				<UserProfile
					key={newInfo}
					fields={formGroups}
					imageGroup={imageGroup}
					passwordGroup={passwordGroup}
					onPasswordSubmit={onPasswordSubmit}
					onSubmit={onSubmit}
				/>
			)}
		</div>
	);
}

export default Profile;
