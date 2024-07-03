import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder, reset } from "../../features/order/orderSlice";
import { getPatientList } from "../../features/patient/patientSlice";
import { getInventory } from "../../features/order/orderSlice";

import ReusableForm from "../../components/reusableform.component";
import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";
import Spinner from "../../components/spinner.component";

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
	const [isOpen, setIsOpen] = useState(false);
	const [patientData, setPatientData] = useState(null);

	function closeModal() {
		setIsOpen(false);
	}

	const patientDetails = location.state;
	const { newOrder, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.order
	);
	const { inventory } = useSelector((state) => state.order);
	const patientReducer = useSelector((state) => state.patient);
	const patient = patientReducer.patient;

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
				console.log(details);
				navigate(`/doctor/add-order/${details._id}`, {
					state: { details },
				});
			},
		},
	];

	useEffect(() => {
		if (!inventory) {
			dispatch(getInventory());
		}
	}, [inventory]);

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
			navigate("/doctor");
			toast.success(message);
		}

		dispatch(reset());
	}, [newOrder, isLoading, isError, isSuccess, message, navigate, dispatch]);

	const onSubmit = (formData) => {
		const orderData = {
			...formData,
			frame: formData.frameID,
			lens: formData.lensID,
			otherItems: formData.otherItems,
			amount: formData.amount,
		};
		const patientId = patientDetails.details._id;
		dispatch(createOrder({ patientId, orderData }));
	};

	const formGroups = [
		{
			label: "Frame",
			size: "w-full",
			fields: [
				[
					{
						label: "Frame *",
						type: "customsearch",
						placeholder: "Frame",
						value: "",
						name: "frame",
						size: "w-full",
						inventory: inventory,
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
						type: "customsearch",
						value: "",
						name: "lens",
						inventory: inventory,
						size: "w-full",
					},
					{
						label: "Quantity in pairs *",
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
						type: "customsearch",
						placeholder: "Item Name",
						value: "",
						name: "otherItems.itemName",
						inventory: inventory,
						size: "w-full",
						clearOnAdd: true,
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

	if (isLoading || patientReducer.isLoading) {
		return <Spinner />;
	}

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
						key={inventory}
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
