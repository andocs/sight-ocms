import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	getRepairDetails,
	updateRepairRequest,
	reset,
} from "../../features/repair/repairSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

const categories = [
	{ category: "Frame" },
	{ category: "Lens" },
	{ category: "Others" },
];

const status = [{ status: "Pending" }, { status: "Cancelled" }];

function EditRepair() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const repairDetails = location.state;
	const requestId = repairDetails.details._id;
	const { repairUpdate, newRepair, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.repair);

	const formGroups = [
		{
			label: "Repair Request Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Item Type",
						type: "listbox",
						value: repairUpdate?.itemType || categories[0].category,
						options: categories.map((category) => category.category),
						name: "itemType",
						size: "w-full",
					},
					{
						label: "Amount",
						type: "number",
						value: repairUpdate?.amount || 1,
						min: 1,
						name: "amount",
						size: "w-full",
					},
					{
						label: "Status",
						type: "listbox",
						value: repairUpdate?.status || status[0].status,
						options: status.map((status) => status.status),
						name: "status",
						size: "w-1/2",
					},
				],
			],
		},
	];

	useEffect(() => {
		if (!repairUpdate) {
			dispatch(getRepairDetails(repairDetails.details._id));
		}
	}, [dispatch, repairUpdate, repairDetails]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!repairDetails) {
			toast.error("No repair selected to view.");
			navigate("/doctor");
		}

		if (isSuccess && newRepair !== null) {
			toast.success(message);
			navigate("/doctor/view-repair");
		}
		dispatch(reset());
	}, [newRepair, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const onSubmit = (formData) => {
		const updateInfo = {};

		const initialData = {
			itemType: repairUpdate.itemType,
			amount: repairUpdate.amount,
			status: repairUpdate.status,
		};
		for (const key in initialData) {
			if (JSON.stringify(initialData[key]) !== JSON.stringify(formData[key])) {
				if (formData[key] !== "") {
					if (formData[key] === undefined) {
						updateInfo[key] = [];
					} else {
						updateInfo[key] = formData[key];
					}
				}
			}
		}
		if (JSON.stringify(updateInfo) === "{}") {
			navigate("/doctor/view-repair");
			dispatch(reset());
		} else {
			const requestData = updateInfo;
			dispatch(updateRepairRequest({ requestId, requestData }));
		}
	};

	return (
		<>
			<ReusableForm
				key={repairUpdate ? repairUpdate._id : "default"}
				header={{
					title: "Edit Repair Record",
					buttontext: "Update Record",
				}}
				fields={formGroups}
				onSubmit={onSubmit}
			/>
		</>
	);
}

export default EditRepair;
