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

	const categories = [
		{ category: "Frame" },
		{ category: "Lens" },
		{ category: "Medicine" },
		{ category: "Others" },
	];

	const units = [{ unit: "piece" }, { unit: "box" }];

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
						value: itemUpdate?.itemName || "",
						size: "w-full",
					},
					{
						type: "listbox",
						label: "CATEGORY *",
						value: itemUpdate?.category || categories[0].category,
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
						value: itemUpdate?.vendor || "",
						placeholder: "Item Vendor",
						size: "w-full",
					},
					{
						type: "number",
						label: "ITEM PRICE *",
						name: "price",
						value: itemUpdate?.price || 1,
						min: 1,
						size: "w-2/5",
					},
				],
				[
					{
						type: "number",
						label: "ITEM QUANTITY *",
						name: "quantity",
						value: itemUpdate?.quantity || 1,
						initial: itemUpdate?.quantity,
						id: itemUpdate?._id,
						category: itemUpdate?.category,
						min: 1,
						size: "w-full",
					},
					{
						type: "number",
						label: "PIECES PER BOX *",
						name: "piecesPerBox",
						unit: itemUpdate?.unit,
						initial: itemUpdate?.piecesPerBox,
						value: itemUpdate?.piecesPerBox || 1,
						min: 1,
						size: "w-2/5",
					},
					{
						type: "listbox",
						label: "ITEM UNIT *",
						name: "unit",
						value: itemUpdate?.unit || units[0].unit,
						options: units.map((unit) => unit.unit),
						size: "w-2/5",
					},
				],
				[
					{
						type: "number",
						label: "CRITICAL LEVEL *",
						name: "criticalLevel",
						value: itemUpdate?.criticalLevel || 1,
						min: 1,
						size: "w-full",
					},
					{
						type: "number",
						label: "RESTOCK LEVEL *",
						name: "restockLevel",
						value: itemUpdate?.restockLevel || 1,
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
						value: itemUpdate?.description || "",
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
					value: itemUpdate?.image || "",
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

	const getDateTwoMonthsFromNow = () => {
		const today = new Date();

		// Get the current month and year
		const currentMonth = today.getMonth();
		const currentYear = today.getFullYear();

		// Calculate the target month, considering it might cross into a new year
		const targetMonth = (currentMonth + 2) % 12;

		// Calculate the target year, considering it might increment
		const targetYear = currentYear + Math.floor((currentMonth + 2) / 12);

		// Create the date for 2 months from now
		const twoMonthsFromNow = new Date(targetYear, targetMonth, today.getDate());

		return twoMonthsFromNow;
	};

	const onSubmit = (formData) => {
		const updateInfo = {};

		const initialData = {
			itemName: itemUpdate.itemName,
			category: itemUpdate.category,
			quantity: itemUpdate.quantity,
			unit: itemUpdate.unit,
			criticalLevel: itemUpdate.criticalLevel,
			restockLevel: itemUpdate.restockLevel,
			price: itemUpdate.price,
			vendor: itemUpdate.vendor,
			description: itemUpdate.description,
			image: itemUpdate.image !== null ? itemUpdate.image : "",
		};

		const defaultDay = getDateTwoMonthsFromNow();

		for (const key in formData) {
			if (JSON.stringify(initialData[key]) !== JSON.stringify(formData[key])) {
				if (key === "expirationDate") {
					if (formData[key].toString() !== defaultDay.toString()) {
						updateInfo[key] = formData[key];
					}
				} else if (key === "piecesPerBox") {
					if (initialData[key] === undefined && formData[key] === null) {
					}
				} else {
					updateInfo[key] = formData[key];
				}
			}
		}
		console.log(updateInfo);

		if (JSON.stringify(updateInfo) === "{}") {
			navigate("/admin/view-inventory");
			dispatch(clear());
			dispatch(reset());
		} else {
			if (updateInfo.image) {
				const itemDetails = new FormData();
				for (const key in updateInfo) {
					itemDetails.append(key, updateInfo[key]);
				}
				dispatch(editInventoryDetails({ itemId, itemDetails }));
			} else {
				const itemDetails = updateInfo;
				dispatch(editInventoryDetails({ itemId, itemDetails }));
			}
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
