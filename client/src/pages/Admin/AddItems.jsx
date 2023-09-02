import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addNewItem, reset } from "../../features/inventory/inventorySlice";
import ReusableForm from "../../components/reusableform.component";

const defaultsvg = (
	<div className="px-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="w-full"
		>
			<path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
		</svg>
	</div>
);

const header = { title: "Add Inventory Items", buttontext: "Add Item" };

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
					value: "",
					size: "w-full",
				},
				{
					type: "number",
					label: "ITEM QUANTITY",
					name: "quantity",
					value: 1,
					min: 1,
					size: "w-full",
				},
				{
					type: "number",
					label: "ITEM PRICE",
					name: "price",
					value: 1,
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
					value: "",
					size: "w-full",
				},
			],
		],
	},
];

const imageGroup = [
	{
		label: "Item Image",
		fields: [
			{
				label: "Image",
				type: "image",
				name: "image",
				size: "w-full",
			},
		],
		placeholder: defaultsvg,
	},
];

function AddItems() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { newItem, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.inventory
	);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (isSuccess && newItem !== null && message !== "") {
			toast.success(message);
			navigate("/admin");
		}

		dispatch(reset());
	}, [newItem, isLoading, isError, isSuccess, message, navigate, dispatch]);

	const onSubmit = (formData) => {
		if (formData.image !== "") {
			const itemData = new FormData();
			itemData.append("itemName", formData.itemName);
			itemData.append("quantity", formData.quantity);
			itemData.append("price", formData.price);
			itemData.append("description", formData.description);
			itemData.append("image", formData.image);
			dispatch(addNewItem(itemData));
		} else {
			dispatch(addNewItem(formData));
		}
	};

	return (
		<>
			<ReusableForm
				header={header}
				fields={formGroups}
				onSubmit={onSubmit}
				imageGroup={imageGroup}
			/>
		</>
	);
}

export default AddItems;
