import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { addRepairRequest, reset } from "../../features/repair/repairSlice";
import { getPatientList } from "../../features/patient/patientSlice";

import ReusableForm from "../../components/reusableform.component";
import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";

const categories = [
	{ category: "Frame" },
	{ category: "Lens" },
	{ category: "Others" },
];

const header = { title: "Create Repair Request", buttontext: "Add Request" };

function CreateRepair() {
	const location = useLocation();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const [patientData, setPatientData] = useState(null);

	function closeModal() {
		setIsOpen(false);
	}

	const patientDetails = location.state;

	const { newRepair, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.repair
	);

	const { patient } = useSelector((state) => state.patient);

	const formGroups = [
		{
			label: "Repair Request Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Item Type",
						type: "listbox",
						value: categories[0].category,
						options: categories.map((category) => category.category),
						name: "itemType",
						size: "w-full",
						clearOnAdd: true,
					},
					{
						label: "Amount",
						type: "number",
						value: 1,
						min: 1,
						name: "amount",
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
				navigate(`/doctor/add-repair/${details._id}`, {
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

		if (isSuccess && newRepair !== null && message !== "") {
			toast.success(message);
			navigate("/doctor");
		}
		dispatch(reset());
	}, [newRepair, isLoading, isError, isSuccess, message, dispatch]);

	const onSubmit = (formData) => {
		const requestData = formData;
		const patientId = patientDetails.details._id;
		dispatch(addRepairRequest({ patientId, requestData }));
	};

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

export default CreateRepair;
