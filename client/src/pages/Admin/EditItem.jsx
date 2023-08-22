import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	editInventoryDetails,
	getItemDetails,
	reset,
	clear,
} from "../../features/inventory/inventorySlice";
import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

function EditItem() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const itemDetails = location.state;
	const itemId = itemDetails.details._id;

	const { itemUpdate, newItem, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.inventory);

	const fields = [
		{
			label: "Item Information",
			fields: [
				[
					{
						type: "text",
						label: "ITEM NAME",
						placeholder: "Item Name",
						name: "itemName",
						value: itemUpdate?.itemName || "",
						size: "w-full",
					},
					{
						type: "number",
						label: "ITEM QUANTITY",
						name: "quantity",
						value: itemUpdate?.quantity || 0,
						min: 1,
						size: "w-full",
					},
					{
						type: "number",
						label: "ITEM PRICE",
						name: "price",
						value: itemUpdate?.price || 0,
						min: 1,
						size: "w-full",
					},
				],
				[
					{
						type: "textarea",
						label: "ITEM DESCRIPTION",
						placeholder: "Item Description here...",
						name: "description",
						value: itemUpdate?.description || "",
						size: "w-full",
					},
				],
			],
		},
	];

	useEffect(() => {
		if (!itemUpdate) {
			dispatch(getItemDetails(itemDetails.details._id));
		}
	}, [dispatch, itemUpdate, itemDetails]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!itemDetails) {
			toast.error("No item selected to view.");
			navigate("/admin");
		}

		if (isSuccess && newItem !== null) {
			toast.success(message);
			navigate("/admin/view-inventory");
		}
		dispatch(reset());
	}, [newItem, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const onSubmit = (formData) => {
		const itemData = {
			itemName: formData.itemName,
			quantity: formData.quantity,
			price: formData.price,
			description: formData.description,
		};

		const initialData = {
			itemName: itemUpdate.itemName,
			quantity: itemUpdate.quantity,
			price: itemUpdate.price,
			description: itemUpdate.description,
		};

		const isDataSame = JSON.stringify(initialData) === JSON.stringify(itemData);

		if (isDataSame) {
			navigate("/admin/view-inventory");
			dispatch(clear());
			dispatch(reset());
		} else {
			const itemDetails = itemData;
			dispatch(editInventoryDetails({ itemId, itemDetails }));
		}
	};

	return (
		<>
			<ReusableForm
				key={itemUpdate ? itemUpdate._id : "default"}
				header={{
					title: "Edit Inventory Item",
					buttontext: "Update Item",
				}}
				fields={fields}
				onSubmit={onSubmit}
			/>
		</>
	);
}

export default EditItem;
