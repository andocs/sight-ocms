import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	getOrderDetails,
	editOrder,
	reset,
} from "../../features/order/orderSlice";
import { getInventory } from "../../features/order/orderSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

const orderStatus = [{ status: "Pending" }, { status: "Cancelled" }];

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

function EditOrders() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const orderDetails = location.state;
	const orderId = orderDetails?.details._id;

	const { orderUpdate, newOrder, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.order);
	const { inventory } = useSelector((state) => state.order);

	useEffect(() => {
		if (!inventory) {
			dispatch(getInventory());
		}
	}, [inventory]);

	const formGroups = [
		{
			label: "Status",
			size: "w-full",
			fields: [
				[
					{
						label: "Order Status",
						type: "listbox",
						value: orderUpdate?.status || "",
						options: orderStatus.map((status) => status.status),
						name: "status",
						size: "w-full",
					},
				],
			],
		},
		{
			label: "Frame",
			size: "w-full",
			fields: [
				[
					{
						label: "Frame *",
						type: "customsearch",
						placeholder: "Frame",
						value: orderUpdate?.frameName || "",
						name: "frame",
						inventory: inventory,
						size: "w-full",
					},
					{
						label: "Quantity *",
						type: "number",
						value: orderUpdate?.frameQuantity || 1,
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
						value: orderUpdate?.lensName || "",
						name: "lens",
						inventory: inventory,
						size: "w-full",
					},
					{
						label: "Quantity *",
						type: "number",
						min: 1,
						value: orderUpdate?.lensQuantity || 1,
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
						size: "w-full",
						inventory: inventory,
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

		{
			fields: [
				[
					{
						value: orderUpdate?.lens || 1,
						name: "lensID",
					},
					{
						value: orderUpdate?.lensPrice || 1,
						name: "lensPrice",
					},
					{
						value: orderUpdate?.frame || 1,
						name: "frameID",
					},
					{
						value: orderUpdate?.framePrice || 1,
						name: "framePrice",
					},
					{
						value: orderUpdate?.amount || 1,
						name: "amount",
					},
				],
			],
		},
	];

	useEffect(() => {
		if (!orderUpdate && orderDetails) {
			dispatch(getOrderDetails(orderDetails.details._id));
		}
	}, [dispatch, orderUpdate]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!orderDetails) {
			toast.error("No order selected to view.");
			navigate("/doctor");
		}

		if (isSuccess && newOrder !== null) {
			toast.success(message);
			navigate("/doctor/view-orders");
		}
		dispatch(reset());
	}, [newOrder, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const onSubmit = (formData) => {
		const updateInfo = {};

		const initialData = {
			status: orderUpdate.status,
			frameID: orderUpdate.frame,
			frameQuantity: orderUpdate.frameQuantity,
			framePrice: orderUpdate.framePrice,
			lensID: orderUpdate.lens,
			lensQuantity: orderUpdate.lensQuantity,
			lensPrice: orderUpdate.lensPrice,
			otherItems: orderUpdate.otherItems !== null ? orderUpdate.otherItems : "",
			amount: orderUpdate.amount,
			frame: orderUpdate.frameName,
			lens: orderUpdate.lensName,
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
			navigate("/doctor/view-orders");
			dispatch(reset());
		} else {
			if (updateInfo["frame"]) {
				updateInfo["frame"] = updateInfo["frameID"];
				delete updateInfo["frameID"];
			} else if (updateInfo["lens"]) {
				updateInfo["lens"] = updateInfo["lensID"];
				delete updateInfo["lensID"];
			}
			const orderData = updateInfo;

			dispatch(editOrder({ orderId, orderData }));
		}
	};

	return (
		<>
			<ReusableForm
				key={orderUpdate ? orderUpdate._id : "default"}
				header={{
					title: "Edit Order Record",
					buttontext: "Update Record",
				}}
				fields={formGroups}
				onSubmit={onSubmit}
				otherItems={orderUpdate?.otherItems ? orderUpdate?.otherItems : null}
			/>
		</>
	);
}

export default EditOrders;
