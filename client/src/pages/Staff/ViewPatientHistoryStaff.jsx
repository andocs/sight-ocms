import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getPatientHistory } from "../../features/patient/patientSlice";

import { Tab } from "@headlessui/react";
import Spinner from "../../components/spinner.component";
import PatientProfile from "../../components/patientprofile.component";

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

function ViewPatientHistoryStaff() {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const errors = [];
	let pushed = 0;
	const patientData = location.state;

	const { patient, isLoading } = useSelector((state) => state.patient);

	useEffect(() => {
		if (!patientData) {
			errors.push("No item selected to view.");
			if (errors.length > 0 && pushed < 1) {
				toast.error("No patient selected to view.");
				pushed++;
			}
			navigate("/doctor/view-patients");
		}

		dispatch(getPatientHistory(patientData.details._id));
	}, []);

	if (isLoading || patient.length === 0) {
		return <Spinner />;
	}

	let values = {};
	const genders = [
		{ gender: "Male" },
		{ gender: "Female" },
		{ gender: "Others" },
	];
	if (patient.length > 0) {
		patient.map((history) =>
			Object.entries(history).map(([key, value]) => {
				values[key] = value;
			})
		);
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
						value: values.patient?.personalInfo?.fname || "",
						name: "fname",
						placeholder: "First Name",
						size: "w-full",
					},
				],
				[
					{
						label: "Last Name",
						type: "text",
						value: values.patient?.personalInfo?.lname || "",
						name: "lname",
						placeholder: "Last Name",
						size: "w-full",
					},
				],
				[
					{
						label: "Gender",
						type: "listbox",
						value: values.patient?.personalInfo?.gender || "N/A",
						options: genders.map((gender) => gender.gender),
						name: "gender",
						size: "w-full",
					},
				],
				[
					{
						label: "Email",
						type: "email",
						value: values.patient?.email || "",
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
						value: values.patient?.personalInfo?.contact || "",
						name: "contact",
						placeholder: "Contact Number",
						size: "w-full",
					},
				],
				[
					{
						label: "Address",
						type: "text",
						value: values.patient?.personalInfo?.address || "",
						name: "address",
						placeholder: "123 Penny Lane",
						size: "w-full",
					},
				],
				[
					{
						label: "City",
						type: "text",
						value: values.patient?.personalInfo?.city || "",
						name: "city",
						placeholder: "City",
						size: "w-full",
					},
				],
				[
					{
						label: "Province",
						type: "text",
						value: values.patient?.personalInfo?.province || "",
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
					value: values.patient?.image || "",
					name: "image",
					size: "w-full",
				},
			],
			fname: values.patient?.personalInfo?.fname
				? values.patient?.personalInfo?.fname
				: values.patient?.personalInfo?.gender === "Female"
				? "Jane"
				: "John",
			lname: values.patient?.personalInfo?.lname || "Doe",
			email: values.patient?.email || "placeholder@email.com",
			role: values.patient?.role
				? values.patient.role.charAt(0).toUpperCase() +
				  values.patient.role.slice(1)
				: "Patient",
			placeholder: defaultsvg,
		},
	];

	const visitColumns = [
		{ header: "Visit Date", field: "visitDate" },
		{ header: "Patient Type", field: "patientType" },
		{ header: "Doctor LName", field: "userLastName" },
		{ header: "Doctor FName", field: "userFirstName" },
		{ header: "Visit Type", field: "visitType" },
		{ header: "Reason", field: "reason" },
	];

	const appointmentColumns = [
		{ header: "Date", field: "appointmentDate" },
		{ header: "Status", field: "status" },
		{ header: "Doctor LName", field: "userLastName" },
		{ header: "Doctor FName", field: "userFirstName" },
		{ header: "Start Time", field: `appointmentStart` },
		{ header: "End Time", field: "appointmentEnd" },
		{ header: "Additional Notes", field: "notes" },
	];

	const patientHistory = [
		{ title: "Patient Data", values: values.patient },
		{ title: "Visit Records", values: values.visit, columns: visitColumns },
		{
			title: "Appointment History",
			values: values.appointments,
			columns: appointmentColumns,
		},
	];

	return (
		<>
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div className="w-full flex flex-row justify-between items-center">
						<p className="font-medium text-5xl">
							{patientData.details.fname} {patientData.details.lname}
							{"'s "}
							History
						</p>
					</div>
				</div>
			</div>
			<div>
				{patient &&
					patient.length > 0 &&
					patientHistory &&
					patientHistory.length > 0 && (
						<div className="lg:w-5/6 p-8">
							<Tab.Group>
								<Tab.List className="flex space-x-1 rounded-xl bg-sky-900/20 p-1">
									{patientHistory.map((header) => (
										<Tab
											key={header.title}
											className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-sky-600 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ui-selected:bg-white  ui-selected:shadow ui-not-selected:text-sky-800 ui-not-selected:hover:bg-white/[0.12] ui-not-selected:hover:text-sky-600"
										>
											{header.title}
										</Tab>
									))}
								</Tab.List>
								<Tab.Panels className="mt-2 p-8 w-full h-full bg-white">
									{patientHistory.map((history) => (
										<>
											{history.title === "Patient Data" ? (
												<Tab.Panel className="w-full h-full">
													<div className="w-full mb-4">
														<p className="text-3xl font-medium">Patient Data</p>
													</div>
													<hr />
													<div className="mt-4 w-full">
														<PatientProfile
															fields={formGroups}
															imageGroup={imageGroup}
														/>
													</div>
												</Tab.Panel>
											) : (
												<Tab.Panel className="w-full h-full">
													<div className="w-full mb-4">
														<p className="text-3xl font-medium">
															{history.title}
														</p>
													</div>
													<hr />
													<div className="w-full overflow-hidden rounded-md shadow-xl border-gray-200 border mt-4">
														<div className="bg-white">
															<table
																id="header"
																className="w-full border-b-2 border-blue-600"
															>
																<thead className="bg-white text-sky-800 ">
																	<tr>
																		{history.columns.map((column) => (
																			<th
																				key={column.field}
																				style={{ width: "115px" }}
																				className="p-4 text-left font-medium"
																			>
																				{column.header}
																			</th>
																		))}
																	</tr>
																</thead>
															</table>
														</div>
														{history.values && history.values.length > 0 ? (
															<div className="bg-white overflow-y-auto overflow-x-hidden">
																<table className="w-full">
																	<tbody>
																		{history.values.map((item, index) => (
																			<tr key={index}>
																				{history.columns.map((column) => (
																					<td
																						key={column.field}
																						className="min-w-[115px] max-w-[115px]  p-4 text-left"
																					>
																						{column.field ===
																						"additionalInfo" ? (
																							<div className="w-24 truncate">
																								{item[column.field]}
																							</div>
																						) : column.field.includes(".") ? (
																							column.field
																								.split(".")
																								.reduce(
																									(obj, key) => obj[key],
																									item
																								)
																						) : column.field ===
																						  "otherItems" ? (
																							<div>
																								{item.otherItems.length > 0
																									? item.otherItems.length === 1
																										? `${item.otherItems[0].itemName}`
																										: "..."
																									: "N/A"}
																							</div>
																						) : column.field === "visitDate" ||
																						  column.field === "orderTime" ||
																						  column.field === "createdAt" ? (
																							<div>
																								{item[column.field]
																									? new Date(
																											item[column.field]
																									  ).toLocaleString("en-US", {
																											month: "short",
																											day: "numeric",
																											year: "numeric",
																											hour: "numeric",
																											minute: "numeric",
																											hour12: true,
																									  })
																									: "N/A"}
																							</div>
																						) : column.field ===
																						  "appointmentDate" ? (
																							<div>
																								{item[column.field]
																									? new Date(
																											item[column.field]
																									  ).toLocaleString("en-US", {
																											month: "long",
																											day: "numeric",
																											year: "numeric",
																									  })
																									: "N/A"}
																							</div>
																						) : item[column.field] === "" ||
																						  item[column.field] ===
																								undefined ? (
																							"N/A"
																						) : (
																							item[column.field]
																						)}
																					</td>
																				))}
																			</tr>
																		))}
																	</tbody>
																</table>
															</div>
														) : (
															<>
																<div className="flex flex-row justify-center space-x-12 items-center bg-white p-8">
																	<img
																		className="w-96"
																		src="/images/nodata.svg"
																		alt=""
																	/>
																	<div className="flex flex-col">
																		<div className="text-center text-5xl font-bold z-50">
																			<p>Oops!</p>
																		</div>
																		<div className="text-center text-xl z-50">
																			<p>There is no data to display.</p>
																		</div>
																	</div>
																</div>
															</>
														)}
													</div>
												</Tab.Panel>
											)}
										</>
									))}
								</Tab.Panels>
							</Tab.Group>
						</div>
					)}
			</div>
		</>
	);
}

export default ViewPatientHistoryStaff;
