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

	const formGroups = [
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

	const defaultsvg = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="w-full"
		>
			<path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
		</svg>
	);

	const imageGroup = [
		{
			label: "Item Image",
			fields: [
				{
					label: "Image",
					type: "image",
					value: itemUpdate?.image || "",
					name: "image",
					size: "w-full",
				},
			],
			placeholder: defaultsvg,
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
		const updateInfo = {};

		const initialData = {
			itemName: itemUpdate.itemName,
			quantity: itemUpdate.quantity,
			price: itemUpdate.price,
			description: itemUpdate.description,
			image: itemUpdate.image !== null ? itemUpdate.image : "",
		};

		for (const key in formData) {
			if (JSON.stringify(initialData[key]) !== JSON.stringify(formData[key])) {
				updateInfo[key] = formData[key];
			}
			console.log(updateInfo);
		}

		if (JSON.stringify(updateInfo) === "{}") {
			navigate("/admin/view-inventory");
			dispatch(clear());
			dispatch(reset());
		} else {
			const itemDetails = new FormData();
			for (const key in updateInfo) {
				itemDetails.append(key, updateInfo[key]);
			}

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
				fields={formGroups}
				imageGroup={imageGroup}
				onSubmit={onSubmit}
			/>
		</>
	);
}

export default EditItem;
