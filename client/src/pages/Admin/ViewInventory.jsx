import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
	clear,
	deleteInventoryItem,
	getInventoryItems,
	reset,
} from "../../features/inventory/inventorySlice";

import Spinner from "../../components/spinner.component";
import DeleteConfirmation from "../../components/deleteconfirmation.component";
import Table from "../../components/table.component";

function ViewInventory() {
	let [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	const [itemId, setItemId] = useState("");

	function closeModal() {
		setIsOpen(false);
	}

	function openModal(itemId) {
		setIsOpen(true);
		setItemId(itemId);
	}

	function checkConfirmation() {
		setConfirmation(true);
		dispatch(deleteInventoryItem(itemId));
		setIsOpen(false);
	}

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { item, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.inventory
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getInventoryItems());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [isError, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const columns = [
		{ header: "Name", field: "itemName" },
		{ header: "Description", field: "description" },
		{ header: "Price", field: "price" },
		{ header: "Quantity", field: "quantity" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				navigate("/admin/item-details", { state: details });
			},
		},
		{
			label: "Update",
			handler: (details) => {
				navigate(`/admin/edit-item/${details._id}`, { state: { details } });
			},
		},
		{
			label: "Delete",
			handler: (details) => {
				openModal(details._id);
			},
		},
	];

	return (
		<>
			<DeleteConfirmation
				isOpen={isOpen}
				closeModal={closeModal}
				onConfirm={checkConfirmation}
			/>

			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Inventory</p>
					</div>
					<div>
						<button
							onClick={() => navigate("/admin/add-item")}
							className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
						>
							Add Item
						</button>
					</div>
				</div>
			</div>

			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={item} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewInventory;
