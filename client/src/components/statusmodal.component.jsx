import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ListBoxInput from "./listboxinput.component";

function StatusModal({ appointment, isOpen, closeModal, handleStatusChange }) {
	const [selectedStatus, setSelectedStatus] = useState(appointment.status);

	const onClose = () => {
		setSelectedStatus(appointment.status);
		closeModal();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleStatusChange(selectedStatus);
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
										Appointment Details
									</Dialog.Title>
									<hr />
									<div className="mt-4 space-y-4 pb-4 mb-28">
										<div className="space-y-6">
											<div className="flex flex-row space-x-4 items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="#94a3b8"
													className="w-6 h-6"
												>
													<path
														fillRule="evenodd"
														d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
														clipRule="evenodd"
													/>
												</svg>
												<div className="flex flex-col">
													<p className="text-md font-medium text-sky-800">
														{appointment.userFirstName}{" "}
														{appointment.userLastName}{" "}
													</p>
													<p className="text-sm text-slate-400">
														{appointment.userContact}
													</p>
												</div>
											</div>

											<div className="flex flex-row space-x-4 items-center">
												<svg
													fill="none"
													stroke="#94a3b8"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													viewBox="0 0 24 24"
													className="ml-0.5 -mr-0.5 w-6 h-6"
												>
													<path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" />
													<path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4" />
													<path d="M22 10 A2 2 0 0 1 20 12 A2 2 0 0 1 18 10 A2 2 0 0 1 22 10 z" />
												</svg>
												<p className="text-md font-medium text-sky-800">
													Dr. {appointment.docFirstName}{" "}
													{appointment.docLastName}
												</p>
											</div>

											<div className="flex flex-row space-x-4 items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="#94a3b8"
													className="w-6 h-6"
												>
													<path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
													<path
														fillRule="evenodd"
														d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
														clipRule="evenodd"
													/>
												</svg>
												<div className="flex flex-col">
													<p className="text-md font-medium text-sky-800">
														{new Date(
															appointment.appointmentDate
														).toLocaleString("en-US", {
															month: "long",
															day: "numeric",
															year: "numeric",
														})}
													</p>
													<p className="text-sm text-slate-400">
														{appointment.appointmentStart} -{" "}
														{appointment.appointmentEnd}
													</p>
												</div>
											</div>

											<div className="flex flex-row space-x-4 items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="#94a3b8"
													className="w-6 h-6"
												>
													<path
														fillRule="evenodd"
														d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
														clipRule="evenodd"
													/>
													<path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
												</svg>
												<p className="text-sm font-medium text-sky-800">
													{appointment.notes ? appointment.notes : "N/A"}
												</p>
											</div>

											<div className="flex flex-row space-x-4 items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="#94a3b8"
													className="w-6 h-6"
												>
													<path
														fillRule="evenodd"
														d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
														clipRule="evenodd"
													/>
												</svg>
												<p className="text-sm font-medium text-sky-800">
													{appointment.status}
												</p>
											</div>
										</div>

										<hr />

										<div className="space-y-4">
											<label className="text-sm uppercase font-medium text-sky-800">
												Change Status:
											</label>
											<ListBoxInput
												options={[
													"Scheduled",
													"Confirmed",
													"Cancelled",
													"For Reschedule",
												]}
												initialValue={selectedStatus}
												onChange={(value) => setSelectedStatus(value)}
											/>
										</div>
									</div>

									<div className="mt-4 space-x-4 flex justify-end">
										<button
											type="submit"
											className="justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
										>
											Save
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

export default StatusModal;
