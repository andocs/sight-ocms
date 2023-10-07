import DoctorCards from "./doctorcards.component";

function ViewAllDoctors({ data, onClick }) {
	const handleClick = (e) => {
		e.preventDefault();
		onClick();
	};

	return (
		<>
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">View Doctors</p>
					</div>
					<div>
						<button
							onClick={handleClick}
							type="button"
							className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
						>
							Back to Dashboard
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-wrap p-8 xl:w-5/6 space-x-16">
				{data.length > 0 &&
					data.map((schedule, scheduleIndex) => (
						<DoctorCards key={scheduleIndex} props={schedule} />
					))}
			</div>
			{/* {sortedData.length === 0 ? (
				<p>No data available.</p>
			) : (
				<div className="flex flex-wrap p-8 xl:w-5/6 justify-center">
					{data.map((item, index) => (
						<div key={index} className="w-1/4 mx-4 mb-8">
							<div className="bg-white p-4 shadow-md rounded-xl relative">
								<div className="flex justify-between">
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
			)} */}
		</>
	);
}

export default ViewAllDoctors;
