import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import ListBoxInput from "./listboxinput.component";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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

function generateUniqueBatchNumber() {
	const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
	const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
	const batchNumber = timestamp + randomString;
	return batchNumber;
}

function RestockModal({ item, isOpen, closeModal, handleRestock }) {
	const initialDate = getDateTwoMonthsFromNow();
	const units = [{ unit: "piece" }, { unit: "box" }];
	const [unit, setUnit] = useState(units[0].unit);
	const [itemQuantity, setItemQuantity] = useState(1);
	const [piecesPerBox, setPPB] = useState(null);
	const [expirationDate, setExpirationDate] = useState(initialDate);

	const onClose = () => {
		setUnit(units[0].unit);
		setItemQuantity(1);
		setPPB(null);
		setExpirationDate(initialDate);
		closeModal();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let quantity = itemQuantity;
		if (unit === "box") {
			quantity = piecesPerBox * itemQuantity;
		}
		if (item.category === "Medicine") {
			const uniqueBatchNumber = generateUniqueBatchNumber();
			const batches = {
				batchNumber: uniqueBatchNumber,
				expirationDate,
				batchQuantity: quantity,
			};
			const updates = { batches, quantity };
			console.log(updates);
			handleRestock(updates);
		} else {
			const updates = { quantity };
			handleRestock(updates);
		}
		setUnit(units[0].unit);
		setItemQuantity(1);
		setPPB(null);
		setExpirationDate(initialDate);
		closeModal();
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto font-jost">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<form onSubmit={handleSubmit}>
									<Dialog.Title
										as="h3"
										className="text-xl mb-4 font-medium leading-6 text-sky-800"
									>
										Restock {item.itemName}
									</Dialog.Title>
									<hr />
									<div className="mt-4 space-y-4 pb-4">
										{/* Quantity input */}
										<div className="space-y-4">
											<label className="text-sm uppercase font-medium text-sky-800">
												Quantity{unit === "box" ? " in boxes:" : ":"}
											</label>
											<input
												type="number"
												min={1}
												value={itemQuantity}
												onChange={(e) => setItemQuantity(e.target.value)}
												className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
											/>
										</div>

										{/* Pieces Per Box input */}
										{unit === "box" && (
											<div className="space-y-4">
												<label className="text-sm uppercase font-medium text-sky-800">
													Pieces Per Box:
												</label>
												<input
													type="number"
													min={1}
													value={
														piecesPerBox === null ? setPPB(1) : piecesPerBox
													}
													onChange={(e) => setPPB(e.target.value)}
													className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
												/>
											</div>
										)}

										{/* Unit selection */}
										<div className="space-y-4">
											<label className="text-sm uppercase font-medium text-sky-800">
												Unit:
											</label>
											<ListBoxInput
												options={units.map((unit) => unit.unit)}
												initialValue={unit}
												onChange={(value) => setUnit(value)}
											/>
										</div>

										{/* Expiration Date selection */}
										{item.category === "Medicine" && (
											<div className="space-y-4">
												<hr />
												<p className="text-sm uppercase font-medium text-sky-800">
													Expiration Date:
												</p>
												<div className="relative w-full">
													<label>
														<DatePicker
															wrapperClassName="w-full"
															popperPlacement="bottom-end"
															popperModifiers={{
																name: "arrow",
																options: { padding: 212 },
															}}
															className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
															selected={getDateTwoMonthsFromNow()}
															onChange={(value) => setExpirationDate(value)}
															minDate={getDateTwoMonthsFromNow()}
														/>
														<div className="w-6 h-6 absolute top-4 right-5 z-10">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																fill="currentColor"
																className="cursor-pointer text-sky-800"
															>
																<path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
																<path
																	fillRule="evenodd"
																	d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
													</label>
												</div>
											</div>
										)}
									</div>

									<div className="mt-4 space-x-4 flex justify-end">
										<button
											type="submit"
											className="justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
										>
											Restock
										</button>
										<button
											type="button"
											className="justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
											onClick={onClose}
										>
											Cancel
										</button>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default RestockModal;
