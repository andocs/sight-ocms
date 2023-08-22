import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ItemDetails() {
	const location = useLocation();
	const navigate = useNavigate();
	const errors = [];
	let pushed = 0;
	const item = location.state;

	useEffect(() => {
		if (!item) {
			errors.push("No item selected to view.");
			if (errors.length > 0 && pushed < 1) {
				toast.error("No item selected to view.");
				pushed++;
			}
			navigate("/admin");
		}
	}, []);

	const editItem = (details) => {
		console.log("clicked", details);
		navigate(`/admin/edit-item/${details._id}`, { state: { details } });
	};

	return (
		<>
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Item Details</p>
					</div>
					<div>
						<button
							type="button"
							onClick={() => editItem(item.details)}
							className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
						>
							Edit Item
						</button>
					</div>
				</div>
			</div>

			<div className="p-8 xl:w-5/6">
				{item ? (
					<div className="flex flex-row space-x-12 justify-center">
						<div className="flex flex-col space-y-2 shadow-md justify-center items-center pb-8 rounded-lg w-1/4">
							<div className="rounded-lg mx-4 mt-2 flex flex-col items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-1/2"
								>
									<path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
								</svg>
							</div>

							<p className="uppercase text-gray-400 font-semibold">ITEM</p>
							<div className="w-full flex flex-row justify-center">
								<p className="font-medium text-4xl text-sky-800 break-words text-center px-4">
									{item.details.itemName}
								</p>
							</div>
						</div>

						<div className="flex flex-col space-y-4 shadow-md rounded-lg w-1/3">
							<div className="p-4">
								<div className="flex flex-row mb-3 items-center">
									<p className="font-medium text-2xl text-sky-800">
										Item Information
									</p>
								</div>

								<hr />

								<div className="flex flex-col space-y-2 mt-4 mx-2">
									<div className="flex flex-row">
										<p className="text-gray-400 font-light">Item Name: </p>
										<p className="mx-1 font-medium">
											{" "}
											{item.details.itemName}{" "}
										</p>
									</div>

									<div className="flex flex-row">
										<p className="text-gray-400 font-light">Description: </p>
										<p className="mx-1 font-medium break-all">
											{" "}
											{item.details.description}{" "}
										</p>
									</div>

									<div className="flex flex-row">
										<p className="text-gray-400 font-light">Price: </p>
										<p className="mx-1 capitalize font-medium">
											{" "}
											{item.details.price}{" "}
										</p>
									</div>

									<div className="flex flex-row">
										<p className="text-gray-400 font-light">Quantity: </p>
										<p className="mx-1 font-medium">
											{" "}
											{item.details.quantity}{" "}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
}

export default ItemDetails;
