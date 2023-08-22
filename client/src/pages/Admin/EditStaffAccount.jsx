import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateUpdate } from "../../utility/validateUpdate";
import {
	editStaffAccount,
	getStaffDetails,
	reset,
	clear,
} from "../../features/staff/staffSlice";
import Spinner from "../../components/spinner.component";

function EditStaffAccount() {
	const genders = [
		{ gender: "Male" },
		{ gender: "Female" },
		{ gender: "Others" },
	];

	const roles = [{ role: "Admin" }, { role: "Doctor" }, { role: "Technician" }];

	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { staffUpdate, newStaff, isLoading, isSuccess, isError, message } =
		useSelector((state) => state.staff);
	const errors = [];
	let pushed = 0;
	const staffDetails = location.state;

	const [formData, setFormData] = useState({
		fname: "",
		lname: "",
		email: "",
		contact: "",
		address: "",
		city: "",
		province: "",
	});

	const { fname, lname, email, contact, address, city, province } = formData;

	const [updatedRole, setUpdatedRole] = useState(useState(roles[0]));

	const [updatedGender, setUpdatedGender] = useState(genders[0]);

	const staffId = staffDetails.details._id;

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (staffUpdate === null) {
			dispatch(getStaffDetails(staffId));
		}

		if ((staffUpdate !== null) & (isSuccess === true)) {
			setUpdatedRole(
				roles.find(
					(roleObj) =>
						roleObj.role.toLowerCase() === staffUpdate.role.toLowerCase()
				)
			);

			setUpdatedGender(
				genders.find(
					(genderObj) =>
						genderObj.gender.toLowerCase() ===
						staffUpdate.personalInfo.gender.toLowerCase()
				)
			);

			setFormData({
				fname: staffUpdate.personalInfo.fname,
				lname: staffUpdate.personalInfo.lname,
				email: staffUpdate.email,
				contact: staffUpdate.personalInfo.contact,
				address: staffUpdate.personalInfo.address,
				city: staffUpdate.personalInfo.city,
				province: staffUpdate.personalInfo.province,
			});
		}
	}, [staffUpdate, isError, message, dispatch]);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}

		if (!staffDetails) {
			errors.push("No account selected to view.");
			if (errors.length > 0 && pushed < 1) {
				toast.error("No account selected to view.");
				pushed++;
			}
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

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = (e) => {
		e.preventDefault();

		const userData = {
			fname,
			lname,
			gender: updatedGender.gender,
			email,
			contact,
			address,
			city,
			province,
			role: updatedRole.role.toLowerCase(),
		};

		const initialData = {
			fname: staffUpdate.personalInfo.fname,
			lname: staffUpdate.personalInfo.lname,
			gender: staffUpdate.personalInfo.gender,
			email: staffUpdate.email,
			contact: staffUpdate.personalInfo.contact,
			address: staffUpdate.personalInfo.address,
			city: staffUpdate.personalInfo.city,
			province: staffUpdate.personalInfo.province,
			role: staffUpdate.role,
		};

		const isDataSame = JSON.stringify(initialData) === JSON.stringify(userData);

		if (isDataSame) {
			navigate("/admin/view-staff");
			dispatch(clear());
			dispatch(reset());
		} else {
			const validationErrors = validateUpdate(userData);
			if (validationErrors.length > 0) {
				if (validationErrors.length > 3) {
					toast.error("Please fill in all the required fields!");
				} else {
					validationErrors.forEach((error) => {
						toast.error(error);
					});
				}
			} else {
				const personalInfo = {
					fname,
					lname,
					gender: userData.gender,
					contact,
					address,
					city,
					province,
				};

				const staffData = { email, role: userData.role, personalInfo };

				dispatch(editStaffAccount({ staffId, staffData }));
				console.log(staffData);
			}
		}
	};

	return (
		<>
			<form onSubmit={onSubmit}>
				<div className="w-full bg-white border-b">
					<div className="p-8 flex justify-between items-center xl:w-5/6">
						<div>
							<p className="font-medium text-5xl">Edit Staff Account</p>
						</div>
						<div>
							<button
								type="submit"
								className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
							>
								Update Account
							</button>
						</div>
					</div>
				</div>

				<div className="pb-32 xl:w-5/6 flex flex-row space-x-8">
					{/* Personal Information */}
					<div className="p-8 w-full">
						<div>
							<p className="text-3xl font-medium">Personal Information</p>

							<div className="flex flex-col">
								<div className="flex flex-row pt-8 justify-evenly">
									<div className="mb-4 px-8 w-full">
										<label
											htmlFor="email"
											className="text-l text-start block w-full mb-4 text-sm font-medium truncate text-sky-800"
										>
											FIRST NAME
										</label>
										<input
											type="text"
											placeholder="First Name"
											name="fname"
											id="fname"
											value={fname}
											onChange={onChange}
											className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div className="mb-4 px-8 w-full">
										<label
											htmlFor="email"
											className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
										>
											LAST NAME
										</label>
										<input
											type="text"
											placeholder="Last Name"
											name="lname"
											id="lname"
											value={lname}
											onChange={onChange}
											className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div className="mb-4 px-8 w-2/5">
										<label
											htmlFor="contact"
											className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
										>
											GENDER
										</label>
										<div className="w-full flex flex-col">
											<Listbox
												value={updatedGender}
												onChange={setUpdatedGender}
											>
												<div className="h-14 w-full flex flex-col border border-sky-800 rounded-lg bg-gray-50">
													<Listbox.Button className="relative w-full h-full cursor-default rounded-lg font-medium bg-gray-50 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-500">
														<span className="block truncate">
															{updatedGender.gender}
														</span>
														<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
															<ChevronDownIcon
																className="h-5 w-5 text-gray-400"
																aria-hidden="true"
															/>
														</span>
													</Listbox.Button>
												</div>
												<div className="w-full relative">
													<Transition
														as={Fragment}
														leave="transition ease-in duration-100"
														leaveFrom="opacity-100"
														leaveTo="opacity-0"
													>
														<Listbox.Options className="absolute bg-white w-full shadow-lg">
															{genders.map((gender, i) => (
																<Listbox.Option
																	key={i}
																	value={gender}
																	className={({ active }) =>
																		`relative cursor-default select-none py-2 pl-10 pr-4 ${
																			active
																				? "bg-sky-100 text-sky-800"
																				: "text-sky-900"
																		}`
																	}
																>
																	{({ selected }) => (
																		<>
																			<span
																				className={`block truncate ${
																					selected
																						? "font-medium"
																						: "font-normal"
																				}`}
																			>
																				{gender.gender}
																			</span>
																			{selected ? (
																				<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-700">
																					<CheckIcon
																						className="h-5 w-5"
																						aria-hidden="true"
																					/>
																				</span>
																			) : null}
																		</>
																	)}
																</Listbox.Option>
															))}
														</Listbox.Options>
													</Transition>
												</div>
											</Listbox>
										</div>
									</div>
								</div>

								<div className="flex flex-row pt-4 justify-evenly">
									<div className="mb-4 px-8 w-full">
										<label
											htmlFor="email"
											className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
										>
											EMAIL ADDRESS
										</label>
										<input
											type="email"
											placeholder="name@email.com"
											name="email"
											id="email"
											value={email}
											onChange={onChange}
											className="placeholder:underline placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div className="mb-4 px-8 w-3/5">
										<label
											htmlFor="contact"
											className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
										>
											CONTACT NUMBER
										</label>
										<input
											type="text"
											placeholder="Contact Number"
											name="contact"
											id="contact"
											value={contact}
											onChange={onChange}
											className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
								</div>

								<div className="flex flex-row pt-4 justify-evenly">
									<div className="mb-4 px-8 w-full">
										<label
											htmlFor="address"
											className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
										>
											ADDRESS
										</label>
										<input
											type="text"
											placeholder="123 Penny Lane"
											name="address"
											id="address"
											value={address}
											onChange={onChange}
											className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div className="mb-4 px-8 w-3/5">
										<label
											htmlFor="city"
											className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
										>
											CITY
										</label>
										<input
											type="text"
											placeholder="City"
											name="city"
											id="city"
											value={city}
											onChange={onChange}
											className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>

									<div className="mb-4 px-8 w-3/5">
										<label
											htmlFor="province"
											className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
										>
											PROVINCE
										</label>
										<input
											type="text"
											placeholder="Province"
											name="province"
											id="province"
											value={province}
											onChange={onChange}
											className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Account Information */}
					<div className="p-8 w-auto inline-block items-center">
						<p className="text-3xl font-medium truncate pb-4">
							Account Information
						</p>

						<div className="rounded-lg p-4">
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
						</div>

						<div className="pt-1 w-full">
							<label
								htmlFor="contact"
								className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
							>
								ROLE
							</label>
							<div className="w-full flex flex-col">
								<Listbox value={updatedRole} onChange={setUpdatedRole}>
									<div className="h-14 w-full flex flex-col border border-sky-800 rounded-lg bg-gray-50">
										<Listbox.Button className="relative w-full h-full cursor-default rounded-lg font-medium bg-gray-50 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-500">
											<span className="block truncate">{updatedRole.role}</span>
											<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
												<ChevronDownIcon
													className="h-5 w-5 text-gray-400"
													aria-hidden="true"
												/>
											</span>
										</Listbox.Button>
									</div>
									<div className="w-full relative">
										<Transition
											as={Fragment}
											leave="transition ease-in duration-100"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
										>
											<Listbox.Options className="absolute bg-white w-full shadow-lg">
												{roles.map((role, i) => (
													<Listbox.Option
														key={i}
														value={role}
														className={({ active }) =>
															`relative cursor-default select-none py-2 pl-10 pr-4 ${
																active
																	? "bg-sky-100 text-sky-800"
																	: "text-sky-900"
															}`
														}
													>
														{({ selected }) => (
															<>
																<span
																	className={`block truncate ${
																		selected ? "font-medium" : "font-normal"
																	}`}
																>
																	{role.role}
																</span>
																{selected ? (
																	<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-700">
																		<CheckIcon
																			className="h-5 w-5"
																			aria-hidden="true"
																		/>
																	</span>
																) : null}
															</>
														)}
													</Listbox.Option>
												))}
											</Listbox.Options>
										</Transition>
									</div>
								</Listbox>
							</div>
						</div>
					</div>
				</div>
			</form>
		</>
	);
}

export default EditStaffAccount;
