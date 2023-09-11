import { useState } from "react";

function DateInput({ value, onChange }) {
	const [date, setDate] = useState(value || "");

	const handleDateChange = (newDate) => {
		setDate(newDate);
		onChange(newDate);
	};

	console.log(date);

	// Function to format the date as "mm/dd/yyyy"
	const formatDate = (inputDate) => {
		const dateObject = new Date(inputDate);
		const year = dateObject.getFullYear();
		const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
		const day = String(dateObject.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	return (
		<input
			type="date"
			value={date ? formatDate(date) : ""}
			onChange={(e) => handleDateChange(e.target.value)}
			onBlur={() => handleDateChange(formatDate(date))}
			className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
		/>
	);
}

export default DateInput;
