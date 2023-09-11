import React from "react";

function ViewCards({ header, columns, data, onClick }) {
	const handleClick = (e) => {
		e.preventDefault();
		onClick();
	};

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
			{data.length === 0 ? (
				<p>No data available.</p>
			) : (
				<div className="flex flex-wrap p-8 xl:w-5/6 justify-center">
					{data.map((item, index) => (
						<div key={index} className="w-1/4 mx-4 mb-8">
							<div className="bg-white p-4 shadow-md rounded-xl">
								<div className="flex justify-between">
									<p className="text-2xl font-semibold">{item.dayOfWeek}</p>
									<div className="space-x-4">
										{/* Add your buttons here */}
										<button className="text-blue-600 hover:text-blue-900">
											Edit
										</button>
										<button className="text-red-600 hover:text-red-900">
											Delete
										</button>
									</div>
								</div>
								<div className="mt-4">
									{columns.map((column, columnIndex) => (
										<div key={columnIndex} className="mb-2">
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
