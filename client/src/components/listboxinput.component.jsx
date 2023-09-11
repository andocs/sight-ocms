import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";

function ListBoxInput({ options, initialValue, onChange }) {
	const [selectedValue, setSelectedValue] = useState(initialValue);

	const handleValueChange = (newValue) => {
		setSelectedValue(newValue);
		onChange(newValue);
	};

	return (
		<div className="w-full flex flex-col">
			<Listbox value={selectedValue} onChange={handleValueChange}>
				{/* Listbox rendering */}
				<div className="h-14 w-full flex flex-col border border-sky-800 rounded-lg bg-gray-50">
					<Listbox.Button className="relative w-full h-full cursor-default rounded-lg font-medium bg-gray-50 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-500">
						<span className="block truncate">{selectedValue}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronDownIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</span>
					</Listbox.Button>
				</div>
				{/* Listbox options */}
				<div className="w-full relative">
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="absolute bg-white w-full shadow-lg max-h-60 z-50 overflow-auto rounded-b-xl">
							{options.map((option, i) => (
								<Listbox.Option
									key={i}
									value={option}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active ? "bg-sky-100 text-sky-800" : "text-sky-900"
										}`
									}
								>
									{({ selected }) => (
										<>
											<span
												className={`block truncate ${
													selected ? "font-medium" : "font-normal"
												}`}
											>
												{option}
											</span>
											{selected ? (
												<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-700">
													<CheckIcon className="h-5 w-5" aria-hidden="true" />
												</span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
}

export default ListBoxInput;
