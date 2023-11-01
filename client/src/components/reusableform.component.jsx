import { useState, useRef, createRef, useEffect, Fragment } from "react";
import { getInventory } from "../features/order/orderSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import ListBoxInput from "./listboxinput.component";
import ImageInput from "./imageinput.component";
import PasswordInput from "./passwordinput.component";
import CustomSearchInput from "./customsearch.component";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function ReusableForm({ header, fields, onSubmit, imageGroup, otherItems }) {
	const initialFormData = fields.reduce((formData, group) => {
		group.fields.forEach((subFields) => {
			subFields.forEach((field) => {
				formData[field.name] = field.value || "";
			});
		});
		return formData;
	}, {});

	if (imageGroup) {
		imageGroup.forEach((group) => {
			group.fields.forEach((field) => {
				initialFormData[field.name] = field.value || "";
			});
		});
	}

	const dispatch = useDispatch();
	const { inventory } = useSelector((state) => state.order);
	const [formData, setFormData] = useState(initialFormData);
	const [divHeight, setDivHeight] = useState(0);

	const [selectedImage, setSelectedImage] = useState(null);

	const [otherItemsList, setOtherItemsList] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [editedQuantity, setEditedQuantity] = useState("");
	const [itemName, setItemName] = useState("");
	const [itemPrice, setItemPrice] = useState("");
	const [itemID, setItemID] = useState("");
	const [isItemSelected, setIsItemSelected] = useState(true);
	const [searchValue, setSearchValue] = useState("");

	const [endTimeOptions, setEndTimeOptions] = useState("");
	const [lunchBreakStartOptions, setLunchBreakStartOptions] = useState("");
	const [lunchBreakEndOptions, setLunchBreakEndOptions] = useState("");

	const [appointmentStartOptions, setAppointmentStartOptions] = useState("");
	const [appointmentEndOptions, setAppointmentEndOptions] = useState("");

	let doctorSchedule = [];
	let doctorAppointments = [];
	let appointmentStartTime = null;
	let existingAppointmentDate = null;
	const timeSlots = [];

	for (let hour = 9; hour <= 17; hour++) {
		for (let minute = 0; minute <= 30; minute += 30) {
			if (hour == 17 && minute == 30) {
				break;
			} else {
				const ampm = hour < 12 ? "AM" : "PM";
				const hourFormatted = hour % 12 || 12;
				const timeSlot = `${hourFormatted.toString().padStart(2, "0")}:${minute
					.toString()
					.padStart(2, "0")} ${ampm}`;
				timeSlots.push(timeSlot);
			}
		}
	}

	const imageInputRef = useRef(null);
	const formGroupRef = useRef(null);
	const customSearchInputRef = createRef(null);

	function getLeadDate(disabled, breaks, existingStart, existingEnd) {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 3);

		const isConflict = (date) => {
			const selectedDate = new Date(date);
			selectedDate.setHours(0, 0, 0, 0);
			const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
				weekday: "long",
			});

			return (
				(disabled && disabled.includes(dayOfWeek)) ||
				(breaks &&
					breaks.some((breakItem) => {
						const breakStartDate =
							new Date(breakItem.startDate).getTime() !==
							existingStart?.getTime()
								? new Date(breakItem.startDate)
								: null;
						const breakEndDate = breakItem.endDate
							? new Date(breakItem.endDate).getTime() !== existingEnd?.getTime()
								? new Date(breakItem.endDate)
								: null
							: null;
						const breakStartDateString = breakStartDate?.toDateString();

						return (
							(breakEndDate &&
								selectedDate >= breakStartDate &&
								selectedDate <= breakEndDate) ||
							(!breakEndDate &&
								selectedDate.toDateString() === breakStartDateString)
						);
					}))
			);
		};

		while (isConflict(tomorrow)) {
			tomorrow.setDate(tomorrow.getDate() + 1); // Move to the next day
		}
		return tomorrow;
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

	function calculateLunchBreakStartOptions(selectedStartTime, selectedEndTime) {
		const minLunchBreakStart = timeSlots.indexOf(selectedStartTime) + 1;
		const maxLunchBreakStart = Math.min(
			timeSlots.indexOf(selectedEndTime) - 2,
			timeSlots.indexOf("12:30 PM")
		);

		const lunchBreakStartOptions = timeSlots.slice(
			minLunchBreakStart,
			maxLunchBreakStart
		);

		return lunchBreakStartOptions;
	}

	function calculateLunchBreakEndOptions(selectedLunchBreakStart) {
		if (selectedLunchBreakStart === "N/A") {
			return [];
		}
		const minLunchBreakEnd = timeSlots.indexOf(selectedLunchBreakStart) + 1;
		const maxLunchBreakEnd = timeSlots.indexOf(selectedLunchBreakStart) + 3;

		const lunchBreakEndOptions = timeSlots.slice(
			minLunchBreakEnd,
			maxLunchBreakEnd
		);

		return lunchBreakEndOptions;
	}

	function isEqualTime(time1, time2) {
		return (
			time1.getHours() === time2.getHours() &&
			time1.getMinutes() === time2.getMinutes()
		);
	}

	function calculateAvailableTimeSlots(
		selectedDate,
		doctorSchedule,
		doctorAppointments,
		existingStartTime,
		existingAppointmentStart
	) {
		if (doctorSchedule.length > 0 && doctorAppointments && selectedDate) {
			const selectedDayOfWeek = selectedDate.toLocaleDateString("en-US", {
				weekday: "long",
			});

			const schedule = doctorSchedule.find(
				(entry) => entry.dayOfWeek === selectedDayOfWeek
			);

			if (schedule && doctorAppointments) {
				const doctorStartTime = parseTime(schedule.startTime);
				const doctorEndTime = parseTime(schedule.endTime);

				const appointmentEndTime = new Date(doctorStartTime);
				appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + 30);
				const bookedTimeSlots = doctorAppointments
					.filter((appointment) => {
						const appointmentDate = new Date(appointment.appointmentDate);
						return (
							appointmentDate.toDateString() === selectedDate.toDateString()
						);
					})
					.map((appointment) => {
						const appointmentDate = new Date(appointment.appointmentDate);
						const existingStart =
							existingStartTime && parseTime(existingStartTime);
						const appointmentStart = parseTime(appointment.appointmentStart);
						if (
							existingAppointmentStart &&
							appointmentDate.toDateString() ===
								existingAppointmentStart.toDateString()
						) {
							if (existingStart.toString() !== appointmentStart.toString()) {
								return appointmentStart;
							} else {
								return undefined;
							}
						} else {
							return appointmentStart;
						}
					})
					.filter((time) => time !== undefined);

				const availableTimeSlots = [];
				let currentTime = new Date(doctorStartTime);

				if (
					schedule.lunchBreakStart === "N/A" &&
					schedule.lunchBreakEnd === "N/A"
				) {
					while (currentTime < doctorEndTime) {
						if (
							currentTime >= doctorStartTime &&
							!bookedTimeSlots.some((bookedTime) =>
								isEqualTime(currentTime, bookedTime)
							)
						) {
							availableTimeSlots.push(formatTime(currentTime));
						}
						currentTime.setMinutes(currentTime.getMinutes() + 30);
					}
					return availableTimeSlots;
				} else {
					const lunchBreakStart = parseTime(schedule.lunchBreakStart);
					const lunchBreakEnd = parseTime(schedule.lunchBreakEnd);

					while (currentTime < doctorEndTime) {
						if (
							currentTime >= doctorStartTime &&
							(currentTime < lunchBreakStart || currentTime >= lunchBreakEnd) &&
							!bookedTimeSlots.some((bookedTime) =>
								isEqualTime(currentTime, bookedTime)
							)
						) {
							availableTimeSlots.push(formatTime(currentTime));
						}
						currentTime.setMinutes(currentTime.getMinutes() + 30);
					}

					return availableTimeSlots;
				}
			} else {
				return [];
			}
		} else {
			return timeSlots;
		}
	}

	function calculateAppointmentEnd(selectedStartTime) {
		let appointmentEndOption = [];
		const startTime = parseTime(selectedStartTime);

		const endTime = new Date(startTime);

		endTime.setMinutes(endTime.getMinutes() + 30);

		appointmentEndOption.push(formatTime(endTime));

		return appointmentEndOption;
	}

	function parseTime(timeString) {
		const parts = timeString.split(" ");
		const timeParts = parts[0].split(":");
		let hours = parseInt(timeParts[0]);
		const minutes = parseInt(timeParts[1]);
		if (parts[1] === "PM" && hours !== 12) {
			hours += 12;
		}
		return new Date(0, 0, 0, hours, minutes);
	}

	function formatTime(time) {
		const hours = time.getHours();
		const minutes = time.getMinutes();
		const ampm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
		return `${formattedHours}:${formattedMinutes} ${ampm}`;
	}

	const handleInputChange = (value) => {
		if (value !== itemName) {
			setItemID("");
			setIsItemSelected(false);
		}
		setSearchValue(value);
	};

	const handleSelect = (item) => {
		setItemName(item.itemName);
		setSearchValue(item.itemName);
		setIsItemSelected(true);
		setItemID(item._id);
		setItemPrice(item.price);
	};

	const handleImageClick = (e) => {
		e.preventDefault();
		imageInputRef.current.click();
	};

	const handleAddItemClick = () => {
		const _id = formData["otherItems._id"];
		const itemName = formData["otherItems.itemName"];
		const quantity = formData["otherItems.quantity"];
		const price = formData["otherItems.price"];
		if (itemName && quantity) {
			const newItem = {
				_id,
				itemName,
				quantity: parseInt(quantity),
				price: parseInt(price),
				total: price * quantity,
			};
			setOtherItemsList((prevList) => [...prevList, newItem]);

			setFormData((prevData) => ({
				...prevData,
				"otherItems._id": "",
				"otherItems.itemName": "",
				"otherItems.quantity": 1,
				"otherItems.price": "",
			}));
			setInputValue("");
			customSearchInputRef.current.clearInputValue();
		}
	};

	const handleAddRepairClick = () => {
		const _id = formData["repairItems._id"];
		const itemName = formData["repairItems.itemName"];
		const quantity = formData["repairItems.quantity"];
		if (itemName && quantity) {
			const newItem = {
				_id,
				itemName,
				quantity: parseInt(quantity),
			};
			setRepairItemsList((prevList) => [...prevList, newItem]);

			setFormData((prevData) => ({
				...prevData,
				"repairItems._id": "",
				"repairItems.itemName": "",
				"repairItems.quantity": 1,
			}));
			setInputValue("");
			customSearchInputRef.current.clearInputValue();
		}
	};

	const toggleEdit = (item) => {
		const updatedOtherItemsList = otherItemsList.map((i) =>
			i === item ? { ...i, isEditing: !i.isEditing } : i
		);
		setItemID(item._id ? item._id : item.itemID);
		setSearchValue(item.itemName);
		setItemName(item.itemName);
		setItemPrice(item.price);
		setEditedQuantity(item.quantity);
		setOtherItemsList(updatedOtherItemsList);
	};

	const handleSaveEditedItem = (editedItem) => {
		if (!itemID) {
			toast.error("No valid item selected");
		} else {
			const updatedOtherItemsList = otherItemsList.map((item) =>
				item === editedItem ? editedItem : item
			);
			editedItem.itemID = itemID;
			editedItem.itemName = searchValue;
			editedItem.price = itemPrice;
			const totalAmount = editedItem.price * parseInt(editedQuantity);
			editedItem.quantity = editedQuantity;
			editedItem.total = totalAmount;

			setOtherItemsList(updatedOtherItemsList);

			editedItem.isEditing = false;
			setItemID("");
			setItemName("");
			setItemPrice("");
			setEditedQuantity("");
			setSearchValue("");
			setIsItemSelected(false);
		}
	};

	const handleChange = (field, value, itemSelected) => {
		if (field === "image") {
			setFormData((prevData) => ({
				...prevData,
				[field]: value,
			}));
			setSelectedImage(value);
		} else if (field === "role") {
			setFormData((prevData) => ({
				...prevData,
				[field]: value.toLowerCase(),
			}));
		} else if (field === "lens" || field === "frame") {
			if (!itemSelected) {
				setFormData((prevData) => ({
					...prevData,
					[field]: "",
					[field + "ID"]: "",
					[field + "Price"]: "",
				}));
			}
		} else if (field === "otherItems.itemName") {
			if (!itemSelected) {
				setFormData((prevData) => ({
					...prevData,
					[field]: "",
					["otherItems._id"]: "",
					["otherItems.price"]: "",
				}));
			}
		} else if (field === "startDate") {
			if (value >= formData.endDate) {
				setFormData((prevData) => ({
					...prevData,
					["endDate"]: value,
				}));
			}
		}
		setFormData((prevData) => ({
			...prevData,
			[field]: value,
		}));
	};

	const handleCustomSearchSelect = (field, value) => {
		if (value.price) {
			if (field === "otherItems.itemName") {
				setFormData((prevData) => ({
					...prevData,
					[field]: value.itemName,
					["otherItems._id"]: value._id,
					["otherItems.price"]: value.price,
				}));
			} else {
				setFormData((prevData) => ({
					...prevData,
					[field]: value.itemName,
					[field + "ID"]: value._id,
					[field + "Price"]: value.price,
				}));
			}
		}
	};

	const handleRemoveItem = (index) => {
		const updatedOtherItemsList = [...otherItemsList];
		const removedItemTotal = updatedOtherItemsList[index].total;

		setFormData((prevData) => ({
			...prevData,
			amount: prevData.amount - removedItemTotal,
		}));
		updatedOtherItemsList.splice(index, 1);

		setOtherItemsList(updatedOtherItemsList);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formData.lens && formData.frame) {
			if (!formData.lensID || !formData.frameID) {
				toast.error("Please select a valid item.");
			} else {
				const totalPrice =
					formData.lensPrice * formData.lensQuantity +
					formData.framePrice * formData.frameQuantity;
				delete formData["addItem"];
				delete formData["otherItems.itemName"];
				delete formData["otherItems.quantity"];
				delete formData["otherItems._id"];
				delete formData["otherItems.price"];
				if (otherItemsList.length > 0) {
					formData.otherItems = otherItemsList;
					const otherItemSum = formData.otherItems.reduce(
						(sum, item) => sum + item.total,
						0
					);
					formData.amount = totalPrice + otherItemSum;
				} else {
					formData.amount = totalPrice;
				}
				onSubmit(formData);
			}
		} else if (formData.piecesPerBox && formData.unit !== "box") {
			formData.piecesPerBox = null;
			onSubmit(formData);
		} else {
			onSubmit(formData);
		}
	};

	const handleOnSearchRemove = () => {
		setItemID("");
	};

	const handleOnRemove = (field) => {
		setFormData((prevData) => ({
			...prevData,
			[field]: "",
			[field + "Quantity"]: 1,
			[field + "SRP"]: "",
			[field + "ID"]: "",
			amount: prevData.amount
				? prevData.amount -
				  prevData[field + "Quantity"] * prevData[field + "SRP"]
				: 0,
		}));
	};

	const renderListBoxInput = (field) => {
		const options =
			field.name === "endTime"
				? endTimeOptions && endTimeOptions
				: field.name === "lunchBreakStart"
				? lunchBreakStartOptions && lunchBreakStartOptions
				: field.name === "lunchBreakEnd"
				? lunchBreakEndOptions && lunchBreakEndOptions
				: field.name === "appointmentStart" && field.options.length === 0
				? appointmentStartOptions && appointmentStartOptions
				: field.name === "appointmentEnd"
				? appointmentEndOptions && appointmentEndOptions
				: field.options;

		if (
			options &&
			(formData[field.name] !== "" || formData[field.name] !== "N/A")
		) {
			return (
				<ListBoxInput
					key={formData[field.name]}
					options={options}
					initialValue={formData[field.name]}
					disabled={field.disabled && field.disabled}
					onChange={(value) => {
						handleChange(field.name, value);
					}}
				/>
			);
		}
		return null;
	};

	const renderInput = (field) => {
		switch (field.type) {
			case "text":
			case "email":
			case "number":
				return (
					<input
						type={field.type}
						placeholder={field.placeholder}
						name={field.name}
						id={field.name}
						step={field.name === "price" ? "any" : null}
						value={
							formData.category === "Medicine" && field.category === "Medicine"
								? (formData[field.name] = field.initial)
								: formData[field.name]
						}
						onChange={(e) => handleChange(field.name, e.target.value)}
						min={field.min}
						disabled={
							field.id &&
							formData.category === "Medicine" &&
							field.category === "Medicine"
						}
						max={
							field.name === "criticalLevel"
								? formData.quantity
								: field.name === "restockLevel"
								? formData.criticalLevel
								: null
						}
						className={`${field.placeholdercss} ${
							field.id &&
							formData.category === "Medicine" &&
							field.category === "Medicine" &&
							"text-slate-400"
						} ${
							field.name === "piecesPerBox" &&
							formData.unit !== "box" &&
							"hidden"
						} placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500`}
					/>
				);
			case "password":
				return (
					<PasswordInput
						text={"start"}
						value={formData[field.name] || ""}
						onChange={(value) => handleChange(field.name, value)}
					/>
				);
			case "image":
				return (
					<ImageInput
						ref={imageInputRef}
						value={formData[field.name] || ""}
						onChange={(value) => handleChange(field.name, value)}
					/>
				);
			case "listbox":
				return renderListBoxInput(field);
			case "textarea":
				return (
					<textarea
						type={field.type}
						placeholder={field.placeholder}
						name={field.name}
						id={field.name}
						value={formData[field.name] || ""}
						onChange={(e) => handleChange(field.name, e.target.value)}
						className="text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
					/>
				);
			case "button":
				if (field.name === "addRepair") {
					return (
						<div className="h-[52px] flex items-center justify-center">
							<button
								type="button"
								onClick={handleAddRepairClick}
								className={`${
									field.size ? `${field.size}` : ""
								} bg-sky-800 text-l rounded-full w-fit uppercase text-center text-sm font-medium truncate text-white`}
							>
								{field.icon}
							</button>
						</div>
					);
				}
				return (
					<div className="h-[52px] flex items-center justify-center">
						<button
							type="button"
							onClick={handleAddItemClick}
							className={`${
								field.size ? `${field.size}` : ""
							} bg-sky-800 text-l rounded-full w-fit uppercase text-center text-sm font-medium truncate text-white`}
						>
							{field.icon}
						</button>
					</div>
				);
			case "customsearch":
				if (field.name === "frame") {
					return (
						<CustomSearchInput
							ref={customSearchInputRef}
							onInputChange={(value, itemSelected) =>
								handleChange(field.name, value, itemSelected)
							}
							onSelect={(selectedItem) =>
								handleCustomSearchSelect(field.name, selectedItem)
							}
							onRemove={(e) => handleOnRemove(field.name)}
							value={formData[field.name] || inputValue}
							placeholder={field.placeholder}
							initialValue={searchValue}
							category={"Frame"}
							inventoryItems={field.inventory}
						/>
					);
				} else if (field.name === "lens") {
					return (
						<CustomSearchInput
							ref={customSearchInputRef}
							onInputChange={(value, itemSelected) =>
								handleChange(field.name, value, itemSelected)
							}
							onSelect={(selectedItem) =>
								handleCustomSearchSelect(field.name, selectedItem)
							}
							onRemove={() => handleOnRemove(field.name)}
							value={formData[field.name] || inputValue}
							placeholder={field.placeholder}
							initialValue={searchValue}
							category={"Lens"}
							inventoryItems={field.inventory}
						/>
					);
				} else {
					return (
						<CustomSearchInput
							ref={customSearchInputRef}
							onInputChange={(value, itemSelected) =>
								handleChange(field.name, value, itemSelected)
							}
							onSelect={(selectedItem) =>
								handleCustomSearchSelect(field.name, selectedItem)
							}
							onRemove={() => handleOnRemove(field.name)}
							value={formData[field.name]}
							placeholder={field.placeholder}
							initialValue={searchValue}
							inventoryItems={field.inventory}
						/>
					);
				}
			case "date":
				const schedule = field?.available;
				const appointment = field?.appointment;
				const disabled = field?.disabled || null;
				const breaks = field?.breaks || null;
				const existingStart = field?.start || null;
				const existingEnd = field?.end || null;
				const existingStartTime = field?.existingStartTime;
				const existingAppointment = field?.existingAppointmentDate;

				if (schedule) {
					doctorSchedule = schedule;
				}
				if (appointment) {
					doctorAppointments = appointment;
				}
				if (existingStartTime) {
					appointmentStartTime = existingStartTime;
				}
				if (existingAppointment) {
					existingAppointmentDate = existingAppointment;
				}
				const isDisabled = (date) => {
					const selectedDate = new Date(date);
					selectedDate.setHours(0, 0, 0, 0);
					const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
						weekday: "long",
					});

					return (
						(disabled &&
							!disabled.includes(dayOfWeek) &&
							breaks &&
							!breaks.some((breakItem) => {
								const breakStartDate =
									new Date(breakItem.startDate).getTime() !==
									existingStart?.getTime()
										? new Date(breakItem.startDate)
										: null;
								const breakEndDate = breakItem.endDate
									? new Date(breakItem.endDate).getTime() !==
									  existingEnd?.getTime()
										? new Date(breakItem.endDate)
										: null
									: null;
								const breakStartDateString = breakStartDate?.toDateString();
								return (
									(breakEndDate &&
										selectedDate >= breakStartDate &&
										selectedDate <= breakEndDate) ||
									(!breakEndDate &&
										selectedDate.toDateString() === breakStartDateString)
								);
							})) ||
						(!disabled && !breaks)
					);
				};

				if (field.name === "expirationDate") {
					return (
						<div
							className={`${
								formData.category !== "Medicine" ? "hidden" : "relative w-full"
							}`}
						>
							<label>
								<DatePicker
									key={formData[field.name]}
									wrapperClassName="w-full"
									popperPlacement="bottom-end"
									popperModifiers={{ name: "arrow", options: { padding: 212 } }}
									className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
									selected={
										formData[field.name] !== ""
											? formData[field.name]
											: (formData[field.name] = getDateTwoMonthsFromNow())
									}
									onChange={(value) => handleChange(field.name, value)}
									minDate={getDateTwoMonthsFromNow()}
								/>
								<div className="w-6 h-6 absolute top-4 right-5 z-10">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="cursor-pointer"
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
					);
				} else if (field.name === "endDate") {
					return (
						<div className="relative w-full">
							<label>
								<DatePicker
									key={formData[field.name]}
									wrapperClassName="w-full"
									popperPlacement="bottom-end"
									popperModifiers={{ name: "arrow", options: { padding: 212 } }}
									className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
									selected={
										formData[field.name] !== ""
											? formData[field.name] <=
											  getLeadDate(
													disabled,
													breaks,
													existingStart,
													existingEnd
											  )
												? getLeadDate(
														disabled,
														breaks,
														existingStart,
														existingEnd
												  )
												: formData[field.name]
											: getLeadDate(
													disabled,
													breaks,
													existingStart,
													existingEnd
											  ) < formData.startDate
											? (formData[field.name] = formData.startDate)
											: (formData[field.name] = getLeadDate(
													disabled,
													breaks,
													existingStart,
													existingEnd
											  ))
									}
									onChange={(value) => handleChange(field.name, value)}
									minDate={
										formData?.startDate >=
										getLeadDate(disabled, breaks, existingStart, existingEnd)
											? formData?.startDate
											: getLeadDate(
													disabled,
													breaks,
													existingStart,
													existingEnd
											  )
									}
									filterDate={isDisabled}
								/>
								<div className="w-6 h-6 absolute top-4 right-5 z-10">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="cursor-pointer"
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
					);
				} else {
					return (
						<div className="relative w-full">
							<label>
								<DatePicker
									key={formData[field.name]}
									wrapperClassName="w-full"
									popperPlacement="bottom-end"
									popperModifiers={{ name: "arrow", options: { padding: 212 } }}
									className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
									selected={
										formData[field.name] !== ""
											? formData[field.name] <=
											  getLeadDate(
													disabled,
													breaks,
													existingStart,
													existingEnd
											  )
												? getLeadDate(
														disabled,
														breaks,
														existingStart,
														existingEnd
												  )
												: formData[field.name]
											: (formData[field.name] = getLeadDate(
													disabled,
													breaks,
													existingStart,
													existingEnd
											  ))
									}
									onChange={(value) => handleChange(field.name, value)}
									minDate={getLeadDate(
										disabled,
										breaks,
										existingStart,
										existingEnd
									)}
									filterDate={isDisabled}
								/>
								<div className="w-6 h-6 absolute top-4 right-5 z-10">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="cursor-pointer"
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
					);
				}
			default:
				return null;
		}
	};

	useEffect(() => {
		if (formGroupRef.current) {
			const height = formGroupRef.current.offsetHeight;
			setDivHeight(height);
		}
		if (otherItems && otherItems.length > 0 && !inventory) {
			dispatch(getInventory());
		}
	}, [otherItems]);

	useEffect(() => {
		if (otherItems && otherItems.length > 0) {
			setOtherItemsList(otherItems);
		}
	}, [otherItems]);

	useEffect(() => {
		if (!formData.startTime) {
			setEndTimeOptions("");
		} else {
			const startIdx = timeSlots.indexOf(formData.startTime);
			const endTimeOptions = timeSlots.slice(startIdx + 6);

			setEndTimeOptions(endTimeOptions);
		}
	}, [formData.startTime]);

	useEffect(() => {
		if (!formData.startTime && !formData.endTime) {
			setLunchBreakStartOptions("");
		} else {
			const lunchBreakStartOptions = calculateLunchBreakStartOptions(
				formData.startTime,
				formData.endTime
			);
			lunchBreakStartOptions.push("N/A");
			setLunchBreakStartOptions(lunchBreakStartOptions);
		}
	}, [formData.startTime, formData.endTime]);

	useEffect(() => {
		if (!formData.lunchBreakStart) {
			setLunchBreakEndOptions("");
		} else {
			const lunchBreakEndOptions = calculateLunchBreakEndOptions(
				formData.lunchBreakStart
			);
			setLunchBreakEndOptions(lunchBreakEndOptions);
		}
	}, [formData.lunchBreakStart]);

	useEffect(() => {
		if (!formData.appointmentDate) {
			setAppointmentStartOptions("");
		} else {
			const availableTimeSlots = calculateAvailableTimeSlots(
				formData.appointmentDate,
				doctorSchedule,
				doctorAppointments,
				appointmentStartTime,
				existingAppointmentDate
			);
			setAppointmentStartOptions(availableTimeSlots);
		}
	}, [formData.appointmentDate]);

	useEffect(() => {
		if (!formData.appointmentStart) {
			setAppointmentEndOptions("");
		} else {
			const appointmentEndOptions = calculateAppointmentEnd(
				formData.appointmentStart
			);
			setAppointmentEndOptions(appointmentEndOptions);
		}
	}, [formData.appointmentStart]);

	useEffect(() => {
		if (endTimeOptions && endTimeOptions.length > 0) {
			if (
				timeSlots.indexOf(endTimeOptions[0]) >
				timeSlots.indexOf(formData["endTime"])
			) {
				setFormData((prevData) => ({
					...prevData,
					endTime: endTimeOptions[0],
				}));
			}
		} else if (endTimeOptions !== "" && endTimeOptions.length === 0) {
			setFormData((prevData) => ({
				...prevData,
				endTime: "N/A",
			}));
		}
	}, [endTimeOptions]);

	useEffect(() => {
		if (lunchBreakStartOptions && lunchBreakStartOptions.length > 0) {
			if (
				timeSlots.indexOf(formData["lunchBreakStart"]) >=
					timeSlots.indexOf(formData["endTime"]) - 2 ||
				timeSlots.indexOf(formData["lunchBreakStart"]) <=
					timeSlots.indexOf(formData["startTime"])
			) {
				setFormData((prevData) => ({
					...prevData,
					lunchBreakStart: lunchBreakStartOptions[0],
				}));
			}
		} else if (
			lunchBreakStartOptions !== "" &&
			lunchBreakStartOptions.length === 0
		) {
			setFormData((prevData) => ({
				...prevData,
				lunchBreakStart: "N/A",
			}));
		}
	}, [formData.endTime, lunchBreakStartOptions]);

	useEffect(() => {
		if (lunchBreakEndOptions && lunchBreakEndOptions.length > 0) {
			if (!lunchBreakEndOptions.includes(formData["lunchBreakEnd"])) {
				setFormData((prevData) => ({
					...prevData,
					lunchBreakEnd: lunchBreakEndOptions[0],
				}));
			}
		} else if (
			lunchBreakEndOptions !== "" &&
			lunchBreakEndOptions.length === 0
		) {
			setFormData((prevData) => ({
				...prevData,
				lunchBreakEnd: "N/A",
			}));
		}
	}, [lunchBreakEndOptions]);

	useEffect(() => {
		if (
			(formData.appointmentStart === "" &&
				appointmentStartOptions &&
				appointmentStartOptions.length > 0) ||
			(appointmentStartOptions.length > 0 &&
				!appointmentStartOptions.includes(formData.appointmentStart))
		) {
			setFormData((prevData) => ({
				...prevData,
				appointmentStart: appointmentStartOptions[0],
			}));
		}
	}, [appointmentStartOptions]);

	useEffect(() => {
		if (appointmentEndOptions && appointmentEndOptions.length > 0) {
			setFormData((prevData) => ({
				...prevData,
				appointmentEnd: appointmentEndOptions[0],
			}));
		} else if (
			appointmentEndOptions !== "" &&
			appointmentEndOptions.length === 0
		) {
			setFormData((prevData) => ({
				...prevData,
				appointmentEnd: "N/A",
			}));
		}
	}, [appointmentEndOptions]);

	return (
		<form
			encType={
				formData["image"] !== ""
					? "multipart/form-data"
					: "application/x-www-form-urlencoded"
			}
			onSubmit={handleSubmit}
		>
			{/* Title with Button */}
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">{header.title}</p>
					</div>
					<div>
						<button
							type="submit"
							className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
						>
							{header.buttontext}
						</button>
					</div>
				</div>
			</div>

			<div className="pb-32">
				<div
					className={`xl:w-5/6${
						imageGroup ? " flex flex-row space-x-8" : " p-8"
					}`}
				>
					<div
						ref={formGroupRef}
						className={`${imageGroup ? "p-8 formgroup inline-block" : ""}`}
					>
						<div className="bg-white rounded-2xl shadow-lg p-4">
							{fields.map((group, groupIndex) => (
								<div
									className={`p-4${imageGroup ? " w-full" : ""}`}
									key={groupIndex}
								>
									<p className="text-3xl font-medium pb-4">{group.label}</p>
									<hr />
									<div className={`${imageGroup ? "" : "flex flex-col"}`}>
										<div className="pt-2">
											{group.label === "Other Items" &&
												otherItemsList &&
												otherItemsList.map((item, index) => (
													<div
														key={index}
														className="flex flex-row py-4 justify-evenly"
													>
														{item.isEditing ? (
															<>
																<div className="mb-4 px-8 w-full">
																	<label className="text-l uppercase text-start block w-full mb-4 text-sm font-medium truncate text-sky-800">
																		Item {index + 1}:{" "}
																	</label>

																	<CustomSearchInput
																		key={inventory}
																		ref={customSearchInputRef}
																		onInputChange={handleInputChange}
																		onSelect={handleSelect}
																		value={searchValue}
																		onRemove={handleOnSearchRemove}
																		inventoryItems={inventory}
																	/>
																</div>

																<div className="mb-4 px-8 w-full">
																	<label className="text-l uppercase text-start block w-full mb-4 text-sm font-medium truncate text-sky-800">
																		Quantity:{" "}
																	</label>

																	<input
																		type="number"
																		value={editedQuantity}
																		onChange={(e) =>
																			setEditedQuantity(e.target.value)
																		}
																		className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
																	/>
																</div>
																<div className="flex flex-row space-x-8 align-middle mt-4 px-8 w-fit">
																	<button
																		type="button"
																		onClick={() => handleSaveEditedItem(item)}
																	>
																		Save
																	</button>
																	<button
																		type="button"
																		onClick={() => toggleEdit(item)}
																	>
																		Cancel
																	</button>
																</div>
															</>
														) : (
															<>
																<div className="px-8 flex flex-row w-full">
																	<p className="text-l uppercase font-medium">
																		Item {index + 1}:
																	</p>
																	<p className="text-l">
																		{item.name ? item.name : item.itemName}
																	</p>
																</div>

																<div className="px-8 flex flex-row w-full">
																	<p className="text-l uppercase font-medium">
																		Quantity:
																	</p>
																	<p className="text-l">{item.quantity}</p>
																</div>
																<div className="px-8 space-x-8 flex flex-row w-fit">
																	<button
																		type="button"
																		onClick={() => toggleEdit(item)}
																		className="text-blue-600 hover:text-blue-800"
																	>
																		Edit
																	</button>
																	<button
																		type="button"
																		onClick={() => handleRemoveItem(index)}
																		className="text-red-600 hover:text-red-800"
																	>
																		Remove
																	</button>
																</div>
															</>
														)}
													</div>
												))}
											{group.fields.map((subFields, subFieldsIndex) => (
												<div
													className="flex flex-row pt-4 justify-evenly"
													key={subFieldsIndex}
												>
													{subFields.map((field, fieldIndex) => (
														<Fragment key={fieldIndex}>
															{field.name === "piecesPerBox" &&
															formData.unit !== "box" ? null : (
																<div className={`mb-4 px-8 ${field.size}`}>
																	<label
																		htmlFor={field.name}
																		className="text-l uppercase text-start block w-full mb-4 text-sm font-medium truncate text-sky-800"
																	>
																		{field.label}
																	</label>

																	{renderInput(field)}
																</div>
															)}
														</Fragment>
													))}
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					{imageGroup ? (
						<div
							style={{ height: `${divHeight}px` }}
							className="p-8 imagegroup flex justify-center"
						>
							{imageGroup.map((imgGroup, imgGroupIndex) => (
								<div
									className="bg-white rounded-2xl shadow-lg p-8 flex flex-col"
									key={imgGroupIndex}
								>
									<p className="text-3xl font-medium truncate pb-4 text-center">
										{imgGroup.label}
									</p>
									<hr />
									<div className="-mx-2 overflow-y-auto overflow-x-hidden">
										{selectedImage ? (
											<div className="flex justify-center mt-10">
												<div className="px-4 relative flex justify-center">
													<div className="absolute rounded-full overflow-hidden imagepreview">
														<div className="w-full h-full">
															<img
																src={URL.createObjectURL(selectedImage)}
																className="w-full object-cover"
																alt=""
															/>
														</div>
													</div>
													<div className="absoluteimgwrapper"></div>
												</div>
											</div>
										) : null}
										{initialFormData.image && !selectedImage ? (
											<div className="flex justify-center mt-10 mb-auto">
												<div className="px-4 relative flex justify-center">
													<div className="imagepreview absolute">
														<div className="w-full h-full rounded-full overflow-hidden">
															<img
																src={`../../public/images/uploads/${initialFormData.image}`}
																className="w-full object-cover"
																alt=""
															/>
														</div>
														<div className="absolute bottom-0 right-0">
															<button onClick={handleImageClick}>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 24 24"
																	fill="currentColor"
																	className="w-5 h-5 cursor-pointer"
																>
																	<path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
																	<path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
																</svg>
															</button>
														</div>
													</div>
													<div className="absoluteimgwrapper"></div>
												</div>
											</div>
										) : null}
										{!selectedImage && !initialFormData.image ? (
											<div className="flex justify-center mt-3 mb-auto">
												<div className="px-4 relative flex justify-center">
													<div className="absolute svgpreview">
														{imgGroup.placeholder}
													</div>
													<div className="absolutesvgwrapper"></div>
												</div>
											</div>
										) : null}

										{imgGroup.fields.map((field, fieldIndex) => (
											<div
												className={`${
													initialFormData.image &&
													!selectedImage &&
													field.name === "image"
														? ""
														: "mx-2 pt-1 flex-wrap"
												}`}
												key={fieldIndex}
											>
												<div
													className={`${
														initialFormData.image &&
														!selectedImage &&
														field.name === "image"
															? ""
															: "py-4"
													}`}
												>
													<div>
														{initialFormData.image &&
														!selectedImage &&
														field.name === "image" ? null : field.name ===
																"expirationDate" &&
														  formData.category !== "Medicine" ? null : (
															<>
																<label
																	htmlFor={field.name}
																	className="text-l uppercase text-start block w-full mb-4 text-sm font-medium truncate text-sky-800"
																>
																	{field.label}
																</label>
															</>
														)}

														{renderInput(field)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					) : null}
				</div>
			</div>
		</form>
	);
}

export default ReusableForm;
