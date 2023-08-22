import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addNewItem, reset } from "../../features/inventory/inventorySlice";

function AddItems() {
	const [formData, setFormData] = useState({
		itemName: "",
		quantity: 0,
		price: 0,
		description: "",
	});

	const { itemName, quantity, price, description } = formData;

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

		if (isSuccess && newItem !== null) {
			toast.success(message);
			navigate("/admin");
		}

		dispatch(reset());
	}, [newItem, isLoading, isError, isSuccess, message, navigate, dispatch]);

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = (e) => {
		e.preventDefault();

		const itemData = {
			itemName,
			quantity,
			price,
			description,
		};
		dispatch(addNewItem(itemData));
	};

	return (
		<>
			<form onSubmit={onSubmit}>
				<div className="w-full bg-white border-b">
					<div className="p-8 flex justify-between items-center xl:w-5/6">
						<div>
							<p className="font-medium text-5xl">Add Inventory Item</p>
						</div>
						<div>
							<button
								type="submit"
								className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
							>
								Add Item
							</button>
						</div>
					</div>
				</div>

				<div className="pb-32">
					<div className="p-8">
						<p className="text-3xl font-medium">Item Information</p>

						<div className="xl:w-5/6 flex flex-col">
							<div className="flex flex-row pt-8 justify-evenly">
								<div className="mb-4 px-8 w-full">
									<label
										htmlFor="itemName"
										className="text-l text-start block w-full mb-4 text-sm font-medium truncate text-sky-800"
									>
										ITEM NAME
									</label>
									<input
										type="text"
										placeholder="Item Name"
										name="itemName"
										id="itemName"
										value={itemName}
										onChange={onChange}
										className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>

								<div className="mb-4 px-8 w-full">
									<label
										htmlFor="quantity"
										className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
									>
										ITEM QUANTITY
									</label>
									<input
										type="number"
										min="1"
										name="quantity"
										id="quantity"
										value={quantity}
										onChange={onChange}
										className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>

								<div className="mb-4 px-8 w-full">
									<label
										htmlFor="price"
										className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
									>
										ITEM PRICE
									</label>
									<input
										type="number"
										min="1"
										name="price"
										id="price"
										value={price}
										onChange={onChange}
										className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>

							<div className="flex flex-row pt-4 justify-evenly">
								<div className="mb-4 px-8 w-full">
									<label
										htmlFor="description"
										className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate"
									>
										ITEM DESCRIPTION
									</label>
									<textarea
										type="text"
										placeholder="Item Description here..."
										name="description"
										id="description"
										value={description}
										onChange={onChange}
										className="text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</>
	);
}

export default AddItems;
