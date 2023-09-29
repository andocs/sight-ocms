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

const categories = [
	{ category: "Frame" },
	{ category: "Lens" },
	{ category: "Medicine" },
	{ category: "Others" },
];

const units = [{ unit: "piece" }, { unit: "box" }];

const header = { title: "Add Inventory Items", buttontext: "Add Item" };

const formGroups = [
	{
		label: "Item Information",
		fields: [
			[
				{
					type: "text",
					label: "ITEM NAME *",
					placeholder: "Item Name",
					name: "itemName",
					value: "",
					size: "w-full",
				},
				{
					type: "listbox",
					label: "CATEGORY *",
					value: categories[0].category,
					options: categories.map((category) => category.category),
					name: "category",
					size: "w-2/5",
				},
			],
			[
				{
					type: "text",
					label: "VENDOR *",
					name: "vendor",
					value: "",
					placeholder: "Item Vendor",
					size: "w-full",
				},
				{
					type: "number",
					label: "ITEM PRICE *",
					name: "price",
					value: 1,
					min: 1,
					size: "w-2/5",
				},
			],
			[
				{
					type: "number",
					label: "ITEM QUANTITY *",
					name: "quantity",
					value: 1,
					min: 1,
					size: "w-full",
				},
				{
					type: "number",
					label: "PIECES PER BOX *",
					name: "piecesPerBox",
					value: 1,
					min: 1,
					size: "w-2/5",
				},
				{
					type: "listbox",
					label: "ITEM UNIT *",
					name: "unit",
					value: units[0].unit,
					options: units.map((unit) => unit.unit),
					size: "w-2/5",
				},
			],
			[
				{
					type: "number",
					label: "CRITICAL LEVEL *",
					name: "criticalLevel",
					value: 1,
					min: 1,
					size: "w-full",
				},
				{
					type: "number",
					label: "RESTOCK LEVEL *",
					name: "restockLevel",
					value: 1,
					min: 1,
					size: "w-full",
				},
			],
			[
				{
					type: "textarea",
					label: "ITEM DESCRIPTION *",
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
			{
				type: "date",
				label: "EXPIRATION DATE *",
				name: "expirationDate",
				value: "",
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

	function generateUniqueBatchNumber() {
		const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
		const randomString = Math.random()
			.toString(36)
			.substring(2, 8)
			.toUpperCase();
		const batchNumber = timestamp + randomString;
		return batchNumber;
	}

	const uniqueBatchNumber = generateUniqueBatchNumber();

	const onSubmit = (formData) => {
		if (formData.unit === "box") {
			formData.quantity = formData.piecesPerBox * formData.quantity;
			formData.criticalLevel = formData.piecesPerBox * formData.criticalLevel;
			formData.restockLevel = formData.piecesPerBox * formData.restockLevel;
		}
		if (formData.image !== "") {
			const itemData = new FormData();
			itemData.append("itemName", formData.itemName);
			itemData.append("category", formData.category);
			itemData.append("vendor", formData.vendor);
			itemData.append("price", formData.price);
			itemData.append("quantity", formData.quantity);
			itemData.append("unit", formData.unit);
			itemData.append("criticalLevel", formData.criticalLevel);
			itemData.append("restockLevel", formData.restockLevel);
			itemData.append("description", formData.description);
			itemData.append("image", formData.image);
			if (formData.category === "Medicine") {
				itemData.append("batchNumber", uniqueBatchNumber);
				itemData.append("expirationDate", formData.expirationDate);
				itemData.append("batchQuantity", formData.quantity);
			}
			if (formData.unit === "box") {
				itemData.append("piecesPerBox", formData.piecesPerBox);
			}
			dispatch(addNewItem(itemData));
		} else {
			formData["batchNumber"] = uniqueBatchNumber;
			formData["expirationDate"] = formData.expirationDate;
			formData["batchQuantity"] = formData.quantity;
			console.log(formData);
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
