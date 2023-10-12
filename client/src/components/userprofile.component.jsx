import { useState, useRef } from "react";
import ListBoxInput from "./listboxinput.component";
import ImageInput from "./imageinput.component";
import PasswordInput from "./passwordinput.component";

function UserProfile({
	fields,
	imageGroup,
	passwordGroup,
	onSubmit,
	onPasswordSubmit,
}) {
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

	const passFormData = passwordGroup.reduce((passwordForm, group) => {
		group.fields.forEach((subFields) => {
			subFields.forEach((field) => {
				passwordForm[field.name] = field.value || "";
			});
		});
		return passwordForm;
	}, {});

	const [formData, setFormData] = useState(initialFormData);
	const [passwordFormData, setPasswordFormData] = useState(passFormData);
	const [selectedImage, setSelectedImage] = useState(null);

	const imageInputRef = useRef(null);

	const handleChange = (field, value) => {
		if (field === "image") {
			setFormData((prevData) => ({
				...prevData,
				[field]: value,
			}));
			setSelectedImage(value);
		}
		if (field === "oldPassword") {
			setPasswordFormData((prevData) => ({
				...prevData,
				[field]: value,
			}));
		}
		if (field === "newPassword") {
			setPasswordFormData((prevData) => ({
				...prevData,
				[field]: value,
			}));
		}
		if (field === "confPassword") {
			setPasswordFormData((prevData) => ({
				...prevData,
				[field]: value,
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				[field]: value,
			}));
		}
	};

	const handleImageClick = (e) => {
		e.preventDefault();
		imageInputRef.current.click();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};
	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		console.log(passwordFormData);
		onPasswordSubmit(passwordFormData);
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
						value={passwordFormData[field.name] || ""}
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
						key={formData[field.name]}
						options={field.options}
						initialValue={formData[field.name] || ""}
						onChange={(value) => {
							handleChange(field.name, value);
						}}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="pb-32 flex flex-row justify-center">
			<div className="px-14 py-8 w-4/6">
				<div className="bg-white rounded-2xl shadow-lg p-4">
					<div>
						<form
							encType={
								formData["image"] !== ""
									? "multipart/form-data"
									: "application/x-www-form-urlencoded"
							}
							onSubmit={handleSubmit}
						>
							{imageGroup && (
								<div>
									{imageGroup.map((imgGroup, imgGroupIndex) => (
										<div
											className="flex flex-row space-x-24"
											key={imgGroupIndex}
										>
											<div className="-mx-2 overflow-y-auto overflow-x-hidden">
												{selectedImage && (
													<div className="flex justify-center px-8 mt-7">
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
												)}
												{initialFormData.image && !selectedImage && (
													<div className="flex justify-center px-8 mt-7 mb-[13px]">
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
												)}
												{!selectedImage && !initialFormData.image && (
													<div className="flex px-8 mb-auto">
														<div className="px-4 relative flex justify-center">
															<div className="absolute svgpreview">
																{imgGroup.placeholder}
															</div>
															<div className="absolutesvgwrapper"></div>
														</div>
													</div>
												)}
											</div>
											<div className="py-16 space-y-4">
												<div>
													<p className="text-5xl font-medium">
														{imgGroup.fname} {imgGroup.lname}
													</p>
												</div>
												<div className="flex flex-row space-x-3">
													<p className="text-lg font-normal text-blue-600">
														{imgGroup.email}
													</p>
													<p className="text-lg font-normal">-</p>
													<p className="text-lg font-normal">{imgGroup.role}</p>
												</div>
												{imgGroup.fields.map((field, fieldIndex) => (
													<div
														className={`${
															initialFormData.image &&
															!selectedImage &&
															field.name === "image"
																? ""
																: "flex-wrap"
														}`}
														key={fieldIndex}
													>
														<div>
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
							)}
							{fields.map((group, groupIndex) => (
								<div className="p-4" key={groupIndex}>
									<div className="flex flex-row justify-between items-center pb-4 mr-8">
										<p className="text-3xl font-medium ">{group.label}</p>
										<div className="relative">
											<button
												type="submit"
												className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900 flex items-center justify-center space-x-2"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="w-4 h-4 -ml-1"
												>
													<path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
												</svg>
												<span>Edit Profile</span>
											</button>
										</div>
									</div>
									<hr />
									<div className="flex flex-col">
										<div className="pt-2">
											{group.fields.map((subFields, subFieldsIndex) => (
												<div
													className="flex flex-row pt-4"
													key={subFieldsIndex}
												>
													{subFields.map((field, fieldIndex) => (
														<div
															className={`mb-4 px-8 flex flex-row space-x-6 ${field.size}`}
															key={fieldIndex}
														>
															<div className="flex items-center">
																{" "}
																{/* Add this div */}
																<p className="pl-2 text-base uppercase text-start block w-[336px] font-medium truncate text-sky-800">
																	{field.label}
																</p>
															</div>

															{renderInput(field)}
														</div>
													))}
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</form>
					</div>
					<div>
						<form onSubmit={handlePasswordSubmit}>
							{passwordGroup.map((group, groupIndex) => (
								<div className="p-4" key={groupIndex}>
									<div className="flex flex-row justify-between items-center pb-4 mr-8">
										<p className="text-3xl font-medium ">{group.label}</p>
										<div className="relative">
											<button
												type="submit"
												className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900 flex items-center justify-center space-x-2"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="w-4 h-4 -ml-1"
												>
													<path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
												</svg>
												<span>Update Password</span>
											</button>
										</div>
									</div>
									<hr />
									<div className="flex flex-col">
										<div className="pt-2">
											{group.fields.map((subFields, subFieldsIndex) => (
												<div
													className="flex flex-row pt-4"
													key={subFieldsIndex}
												>
													{subFields.map((field, fieldIndex) => (
														<div
															className={`mb-4 px-8 flex flex-row space-x-6 ${field.size}`}
															key={fieldIndex}
														>
															<div className="flex items-center">
																{" "}
																<p className="pl-2 text-base uppercase text-start block w-[336px] font-medium truncate text-sky-800">
																	{field.label}
																</p>
															</div>

															{renderInput(field)}
														</div>
													))}
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserProfile;
