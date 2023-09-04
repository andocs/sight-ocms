import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder, reset } from "../../features/order/orderSlice";
import { getInventoryItems } from "../../features/inventory/inventorySlice";
import { getPatientList } from "../../features/patient/patientSlice";

import ReusableForm from "../../components/reusableform.component";
import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";

const header = { title: "Create Order", buttontext: "Add Order Request" };

const addsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-6 h-6"
	>
		<path
			fillRule="evenodd"
			d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
			clipRule="evenodd"
		/>
	</svg>
);

function AddOrders() {
	const location = useLocation();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	let [isOpen, setIsOpen] = useState(false);
	const [patientData, setPatientData] = useState(null);

	function closeModal() {
		setIsOpen(false);
	}

	const patientDetails = location.state;
	const { newOrder, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.order
	);
	const { patient } = useSelector((state) => state.patient);

	const formGroups = [
		{
			label: "Frame",
			size: "w-full",
			fields: [
				[
					{
						label: "Frame *",
						type: "text",
						placeholder: "Frame",
						value: "",
						name: "frame",
						size: "w-full",
					},
					{
						label: "Quantity *",
						type: "number",
						value: 1,
						min: 1,
						name: "frameQuantity",
						size: "w-full",
					},
				],
			],
		},
		{
			label: "Lens",
			size: "w-full",
			fields: [
				[
					{
						label: "Lens *",
						placeholder: "Lens",
						type: "text",
						value: "",
						name: "lens",
						size: "w-full",
					},
					{
						label: "Quantity *",
						type: "number",
						min: 1,
						value: 1,
						name: "lensQuantity",
						size: "w-full",
					},
				],
			],
		},
		{
			label: "Other Items",
			size: "w-full",
			fields: [
				[
					{
						label: "Item Name",
						type: "text",
						placeholder: "Item Name",
						value: "",
						name: "otherItems.item",
						size: "w-full",
					},
					{
						label: "Quantity",
						type: "number",
						value: 1,
						min: 1,
						name: "otherItems.quantity",
						size: "w-full",
					},
					{
						name: "addItem",
						type: "button",
						size: "w-fit",
						icon: addsvg,
						label: "Add Item",
						action: (formData) => {
							console.log("Button 1 clicked with form data:", formData);
						},
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
				navigate(`/doctor/add-order/${details._id}`, {
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

		if (isSuccess && newOrder !== null && message !== "") {
			toast.success(message);
		}

		dispatch(reset());
	}, [newOrder, isLoading, isError, isSuccess, message, navigate, dispatch]);

	const onSubmit = (formData) => {
		const orderData = formData;
		const patientId = patientDetails.details._id;
		dispatch(createOrder({ patientId, orderData }));
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

export default AddOrders;
