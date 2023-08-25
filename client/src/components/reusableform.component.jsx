import { useState, useRef, useEffect } from "react";
import ListBoxInput from "./listboxinput.component";
import ImageInput from "./imageinput.component";
import PasswordInput from "./passwordinput.component";

function ReusableForm({ header, fields, onSubmit, imageGroup }) {
	const initialFormData = fields.reduce((formData, group) => {
		group.fields.forEach((subFields) => {
			subFields.forEach((field) => {
				formData[field.name] = field.value || "";
			});
		});
		console.log(formData);
		return formData;
	}, {});

	if (imageGroup) {
		imageGroup.forEach((group) => {
			group.fields.forEach((field) => {
				initialFormData[field.name] = field.value || "";
			});
		});
	}

	const [formData, setFormData] = useState(initialFormData);
	const [selectedImage, setSelectedImage] = useState(null);
	const [divHeight, setDivHeight] = useState(0);

	const imageInputRef = useRef(null);
	const formGroupRef = useRef(null);

	const handleImageClick = (e) => {
		e.preventDefault();
		imageInputRef.current.click();
	};

	useEffect(() => {
		if (formGroupRef.current) {
			const height = formGroupRef.current.offsetHeight; // includes padding and border
			setDivHeight(height);
		}
	}, []);

	const handleChange = (field, value) => {
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
		}
		setFormData((prevData) => ({
			...prevData,
			[field]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
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
						value={formData[field.name] || ""}
						onChange={(e) => handleChange(field.name, e.target.value)}
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
			default:
				return null;
		}
	};

	return (
		<form encType="multipart/form-data" onSubmit={handleSubmit}>
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
