import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

function getItemFieldValue(item, field) {
	if (field.includes(".")) {
		const parts = field.split(".");
		let value = item;
		for (const part of parts) {
			if (value.hasOwnProperty(part)) {
				value = value[part];
			} else {
				return "N/A";
			}
		}
		return value;
	} else if (field === "otherItems") {
		return item[field].length > 0 ? "" : "N/A";
	} else {
		return item[field] === "" || !item[field] ? "N/A" : item[field];
	}
}

function ViewModal({
	isOpen,
	closeModal,
	dataFields,
	columnHeaders,
	modalTitle,
}) {
	const formatDate = (dateString) => {
		if (!dateString) {
			return "N/A";
		}
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const formatDateandTime = (dateString) => {
		if (!dateString) {
			return "N/A";
		}
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		};
		return new Date(dateString).toLocaleString(undefined, options);
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={closeModal}>
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

				<div className="fixed inset-0 overflow-y-auto">
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
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900"
								>
									{modalTitle}
								</Dialog.Title>
								<div className="mt-4 space-y-4">
									{columnHeaders.map((title, index) => (
										<div key={index}>
											<div>
												<p className="text-sm text-gray-500">
													<strong>{title.header}</strong>
													{": "}
													{title.field === "appointmentDate" ||
													title.field === "startDate" ||
													title.field === "endDate"
														? formatDate(dataFields[title.field])
														: title.field === "createdAt" ||
														  title.field === "orderTime" ||
														  title.field === "acceptTime" ||
														  title.field === "completeTime" ||
														  title.field === "visitDate"
														? formatDateandTime(dataFields[title.field])
														: getItemFieldValue(dataFields, title.field)}
												</p>
											</div>
											{title.field === "otherItems" && (
												<div>
													<hr className="mt-4" />
													{dataFields.otherItems?.length > 0 &&
														dataFields.otherItems.map((item, index) => (
															<div key={index}>
																<div className="flex flex-row space-x-2 mt-4">
																	<p className="text-sm text-gray-500">
																		<strong>Item {index + 1}: </strong>
																		{item.itemName}
																	</p>
																	<p className="text-sm text-gray-500">
																		<strong>Quantity: </strong>
																		{item.quantity}
																	</p>
																	<p className="text-sm text-gray-500">
																		<strong>Price: </strong>
																		{item.price}
																	</p>
																</div>
															</div>
														))}
												</div>
											)}
										</div>
									))}
								</div>

								<div className="mt-4 space-x-4 flex justify-end">
									<button
										type="button"
										className="justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
										onClick={closeModal}
									>
										Close
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default ViewModal;
