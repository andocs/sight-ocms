import React from "react";

function ViewCards({ header, columns, data, onClick, actions }) {
	const handleClick = (e) => {
		e.preventDefault();
		onClick();
	};

	const daysOfWeek = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];

	const sortedData = [...data].sort((a, b) => {
		if (a.hasOwnProperty("dayOfWeek") && b.hasOwnProperty("dayOfWeek")) {
			const dayA = daysOfWeek.indexOf(a.dayOfWeek);
			const dayB = daysOfWeek.indexOf(b.dayOfWeek);
			return dayA - dayB;
		}
		return 0;
	});

	return (
		<>
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">{header.title}</p>
					</div>
					<div>
						<button
							type="button"
							onClick={handleClick}
							className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
						>
							{header.buttontext}
						</button>
					</div>
				</div>
			</div>
			{sortedData.length === 0 ? (
				<p>No data available.</p>
			) : (
				<div className="flex flex-wrap p-8 xl:w-5/6 justify-center">
					{sortedData.map((item, index) => (
						<div key={index} className="w-1/4 mx-4 mb-8">
							<div className="bg-white p-4 shadow-md rounded-xl relative">
								<div className="flex justify-between">
									{item.hasOwnProperty("dayOfWeek") && (
										<p className="text-2xl font-semibold">{item.dayOfWeek}</p>
									)}
									<div className="space-x-4 absolute top-4 right-4">
										{actions.map((action, actionIndex) => (
											<button
												key={actionIndex}
												onClick={() => action.handler(item)}
												className={
													action.css
														? `text-${action.css}-600 hover:text-${action.css}-900`
														: `text-blue-600 hover:text-blue-900`
												}
											>
												{action.label}
											</button>
										))}
									</div>
								</div>
								<div className="mt-4">
									{columns.map((column, columnIndex) => (
										<div key={columnIndex} className="mb-2">
											{item.hasOwnProperty(column.field) && (
												<>
													{column.header !== "Day of Week" && (
														<>
															<p className="text-gray-500 font-medium">
																{column.header}
															</p>
															<p className="text-black">
																{column.field === "isLeave" ||
																column.field === "isEmergencyBreak"
																	? item[column.field]
																		? "Yes"
																		: "No"
																	: item[column.field]}
															</p>
														</>
													)}
												</>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
}

export default ViewCards;
