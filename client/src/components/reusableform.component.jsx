import { useState } from "react";
import ListBoxInput from "./listboxinput.component";

function ReusableForm({ header, fields, onSubmit }) {
	const initialFormData = fields.reduce((formData, group) => {
		group.fields.forEach((subFields) => {
			subFields.forEach((field) => {
				formData[field.name] = field.value || "";
			});
		});
		return formData;
	}, {});

	const [formData, setFormData] = useState(initialFormData);

	const handleChange = (field, value) => {
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
			case "password":
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
		<form onSubmit={handleSubmit}>
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
				{fields.map((group, groupIndex) => (
					<div className="p-8" key={groupIndex}>
						<p className="text-3xl font-medium">{group.label}</p>
						<div className="xl:w-5/6 flex flex-col">
							<div className="pt-4">
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
		</form>
	);
}

export default ReusableForm;
