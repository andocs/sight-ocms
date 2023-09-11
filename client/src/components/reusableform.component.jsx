import { useState, useRef, createRef, useEffect } from "react";
import ListBoxInput from "./listboxinput.component";
import ImageInput from "./imageinput.component";
import PasswordInput from "./passwordinput.component";
import CustomSearchInput from "./customsearch.component";

import DateInput from "./datetimeinput.component";

import { toast } from "react-toastify";

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
	const [otherItemsList, setOtherItemsList] = useState([]);
	const [formData, setFormData] = useState(initialFormData);
	const [inputValue, setInputValue] = useState("");
	const [editedQuantity, setEditedQuantity] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [divHeight, setDivHeight] = useState(0);
	const [itemName, setItemName] = useState("");
	const [itemPrice, setItemPrice] = useState("");
	const [itemID, setItemID] = useState("");
	const [isItemSelected, setIsItemSelected] = useState(true);
	const [searchValue, setSearchValue] = useState("");

	const imageInputRef = useRef(null);
	const formGroupRef = useRef(null);
	const customSearchInputRef = createRef();

	useEffect(() => {
		if (formGroupRef.current) {
			const height = formGroupRef.current.offsetHeight;
			setDivHeight(height);
		}
	}, []);

	useEffect(() => {
		if (otherItems) {
			setOtherItemsList(otherItems);
		}
	}, [otherItems]);

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
		console.log("click");
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
			console.log(newItem);
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
		console.log(otherItemsList);
	};

	const toggleEdit = (item) => {
		console.log(item);
		const updatedOtherItemsList = otherItemsList.map((i) =>
			i === item ? { ...i, isEditing: !i.isEditing } : i
		);
		setItemID(item._id ? item._id : item.itemID);
		setOtherItemsList(updatedOtherItemsList);
		setSearchValue(item.itemName);
		setItemName(item.itemName);
		setItemPrice(item.price);
		setEditedQuantity(item.quantity);
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
			console.log(otherItemsList);

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
						value={formData[field.name] || ""}
						onChange={(e) => handleChange(field.name, e.target.value)}
						min={field.min}
						className={`${field.placeholdercss} placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500`}
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
				return (
					<ListBoxInput
						options={field.options}
						initialValue={formData[field.name] || ""}
						onChange={(value) => handleChange(field.name, value)}
					/>
				);
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
					/>
				);
			case "date":
				return (
					<DateInput
						value={formData[field.name] || ""}
						onChange={(value) => handleChange(field.name, value)}
					/>
				);
			default:
				return null;
		}
	};

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
																		ref={customSearchInputRef}
																		onInputChange={handleInputChange}
																		onSelect={handleSelect}
																		value={searchValue}
																		onRemove={handleOnSearchRemove}
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
														<div
															className={`mb-4 px-8 ${field.size}`}
															key={fieldIndex}
														>
															<label
																htmlFor={field.name}
																className="text-l uppercase text-start block w-full mb-4 text-sm font-medium truncate text-sky-800"
															>
																{field.label}
															</label>

															{renderInput(field)}
														</div>
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
														field.name === "image" ? null : (
															<label
																htmlFor={field.name}
																className="text-l uppercase text-start block w-full mb-4 text-sm font-medium truncate text-sky-800"
															>
																{field.label}
															</label>
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
