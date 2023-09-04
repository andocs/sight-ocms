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
	} else {
		return item[field];
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
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-20" onClose={closeModal}>
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
										<p key={index} className="text-sm text-gray-500">
											<strong>{title.header}</strong>
											{": "}
											{title.field === "createdAt"
												? formatDate(dataFields[title.field])
												: getItemFieldValue(dataFields, title.field)}
										</p>
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
