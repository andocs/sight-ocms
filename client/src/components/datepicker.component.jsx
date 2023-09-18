import React, { useState } from "react";

function CustomDatePicker({ value, onChange, disabledDates }) {
	const [selectedDate, setSelectedDate] = useState(
		value ? new Date(value) : null
	);

	const handleDateChange = (newDate) => {
		setSelectedDate(newDate);
		onChange(newDate);
	};

	const isDateDisabled = (date) => {
		const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
			weekday: "long",
		});
		return disabledDates.includes(dayOfWeek);
	};
	// Function to generate an array of dates for a specific month and year
	const getDatesInMonth = (year, month) => {
		const startDate = new Date(year, month, 1);
		const endDate = new Date(year, month + 1, 0);
		const dates = [];

		for (
			let date = startDate;
			date <= endDate;
			date.setDate(date.getDate() + 1)
		) {
			dates.push(new Date(date));
		}

		return dates;
	};

	const renderCalendar = () => {
		const today = new Date();
		const year = selectedDate
			? selectedDate.getFullYear()
			: today.getFullYear();
		const month = selectedDate ? selectedDate.getMonth() : today.getMonth();

		const datesInMonth = getDatesInMonth(year, month);

		return (
			<div className="calendar">
				<table>
					<thead>
						<tr>
							<th>Sun</th>
							<th>Mon</th>
							<th>Tue</th>
							<th>Wed</th>
							<th>Thu</th>
							<th>Fri</th>
							<th>Sat</th>
						</tr>
					</thead>
					<tbody>
						{datesInMonth.map((date) => (
							<tr key={date.toDateString()}>
								{Array.from({ length: 7 }).map((_, index) => {
									const day = date.getDay();
									const isCurrentMonth = date.getMonth() === month;
									const isDisabled = isDateDisabled(date.toDateString());
									const isSelected =
										selectedDate &&
										date.toDateString() === selectedDate.toDateString();

									return (
										<td
											key={index}
											className={`${!isCurrentMonth ? "other-month" : ""} ${
												isDisabled ? "disabled" : ""
											} ${isSelected ? "selected" : ""}`}
											onClick={() => !isDisabled && handleDateChange(date)}
										>
											{date.getDate()}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	return <div className="custom-date-picker">{renderCalendar()}</div>;
}

export default CustomDatePicker;
