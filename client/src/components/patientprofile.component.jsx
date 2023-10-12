import { useState, useRef } from "react";
import ListBoxInput from "./listboxinput.component";
import ImageInput from "./imageinput.component";

function PatientProfile({ fields, imageGroup }) {
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

	const [formData, setFormData] = useState(initialFormData);

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

	const renderInput = (field) => {
		switch (field.type) {
			case "text":
			case "email":
			case "number":
				return (
					<input
						disabled
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
						disabled
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
		<div className="w-full flex flex-row justify-center">
			<div className="bg-white p-4 w-[1000px]">
				<div>
					{imageGroup && (
						<div>
							{imageGroup.map((imgGroup, imgGroupIndex) => (
								<div className="flex flex-row space-x-24" key={imgGroupIndex}>
									<div className="-mx-2 overflow-y-auto overflow-x-hidden">
										{initialFormData.image && (
											<div className="flex justify-center px-8 mt-7 mb-[13px]">
												<div className="px-4 relative flex justify-center">
													<div className="imagepreview absolute">
														<div className="w-full h-full rounded-full overflow-hidden">
															<img
																src={`/images/uploads/${initialFormData.image}`}
																className="w-full object-cover"
																alt=""
															/>
														</div>
													</div>
													<div className="absoluteimgwrapper"></div>
												</div>
											</div>
										)}
										{!initialFormData.image && (
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
									</div>
								</div>
							))}
						</div>
					)}
					{fields.map((group, groupIndex) => (
						<div className="p-4" key={groupIndex}>
							<div className="flex flex-row justify-between items-center pb-4 mr-8">
								<p className="text-3xl font-medium ">{group.label}</p>
								<div className="relative"></div>
							</div>
							<hr />
							<div className="flex flex-col">
								<div className="pt-2">
									{group.fields.map((subFields, subFieldsIndex) => (
										<div className="flex flex-row pt-4" key={subFieldsIndex}>
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
				</div>
			</div>
		</div>
	);
}

export default PatientProfile;
