import { Fragment, useState } from "react";
import decode from "jwt-decode";

const ReusableTable = ({ data, columns, actions }) => {
	const token = localStorage.getItem("user");

	const decodedToken = decode(token);
	const role = decodedToken.user.role;
	const user = decodedToken.user.id;

	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 6;

	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;

	function getItemFieldValue(item, field) {
		if (field.includes(".")) {
			const parts = field.split(".");
			let value = item;
			for (const part of parts) {
				if (value.hasOwnProperty(part)) {
					value = value[part];
				} else {
					return "N/A";
				}
			}
			return value;
		} else {
			return item[field];
		}
	}

	const filteredData = data.filter((item) => {
		const itemValues = columns.map((column) => {
			const fieldValue = getItemFieldValue(item, column.field);
			return fieldValue ? fieldValue.toString().toLowerCase() : "";
		});

		const query = searchQuery.toLowerCase();
		return itemValues.some((value) => value.includes(query));
	});

	const totalPages = Math.ceil(filteredData.length / rowsPerPage);

	const visibleData = filteredData.slice(startIndex, endIndex);

	if (!data || data.length === 0) {
		return (
			<div className="bg-white border-gray-200 shadow-lg flex flex-col w-full justify-center items-center">
				<div className="p-8 flex space-x-16 flex-row">
					<div className="-ml-20 flex w-[800px]">
						<img className="h-full" src="/images/nodata.svg" alt="" />
					</div>
					<div className="flex flex-col justify-center">
						<div className="text-center text-7xl font-bold z-50">
							<p>Oops!</p>
						</div>
						<div className="text-center text-2xl z-50">
							<p>There is no data to display.</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full space-y-6">
			<div className="w-full flex flex-col">
				<input
					type="text"
					placeholder="Search..."
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
						setCurrentPage(1);
					}}
				/>
			</div>
			<div className="w-full rounded-t-lg overflow-hidden">
				<div className="rounded-b-xl overflow-hidden mb-10">
					<table className="w-full">
						<thead className="bg-sky-800 text-white p-4 header-shadow relative z-20 text-left">
							<tr>
								{columns.map((column, index) => (
									<th key={index} className="px-6 py-3">
										{column.header}
									</th>
								))}
								<th
									className="px-6 py-3 text-center"
									style={{ width: `${120 / (columns.length + 1)}%` }}
								>
									Actions
								</th>
							</tr>
						</thead>

						<tbody
							id="table"
							className="bg-cyan-100 text-sky-800 p-4 relative z-0 text-left"
						>
							{visibleData.map((item, index) => (
								<tr key={index} className="hover:bg-cyan-50">
									{columns.map((column, innerIndex) => (
										<td
											key={innerIndex}
											className={`px-6 py-4 ${
												column.field === "role" || column.field === "operation"
													? "capitalize"
													: ""
											}`}
										>
											{column.field === "additionalInfo" ? (
												<div className="w-24 truncate">
													{item[column.field]}
												</div>
											) : column.field.includes(".") ? (
												column.field
													.split(".")
													.reduce((obj, key) => obj[key], item)
											) : column.field === "otherItems" ? (
												<div>
													{item.otherItems.length > 0
														? item.otherItems.length === 1
															? `${item.otherItems[0].itemName}`
															: "..."
														: "N/A"}
												</div>
											) : column.field === "visitDate" ||
											  column.field === "orderTime" ||
											  column.field === "createdAt" ? (
												<div>
													{item[column.field]
														? new Date(item[column.field]).toLocaleString(
																"en-US",
																{
																	month: "short",
																	day: "numeric",
																	year: "numeric",
																	hour: "numeric",
																	minute: "numeric",
																	hour12: true,
																}
														  )
														: "N/A"}
												</div>
											) : column.field === "appointmentDate" ||
											  column.field === "startDate" ||
											  column.field === "endDate" ? (
												<div>
													{item[column.field]
														? new Date(item[column.field]).toLocaleString(
																"en-US",
																{
																	month: "long",
																	day: "numeric",
																	year: "numeric",
																}
														  )
														: "N/A"}
												</div>
											) : item[column.field] === "" ||
											  item[column.field] === undefined ? (
												"N/A"
											) : (
												item[column.field]
											)}
										</td>
									))}
									{actions.length !== 1 ? (
										<td className="px-6 py-4 flex space-x-2">
											{actions.map((action, actionIndex) => (
												<Fragment key={actionIndex}>
													{item["status"] ? (
														item["status"] === "Completed" ||
														item["status"] === "Cancelled" ? (
															action.label === "View" && (
																<button
																	key={actionIndex}
																	onClick={() => action.handler(item)}
																	className="flex-1 bg-white rounded-lg shadow-lg truncate"
																>
																	{action.label}
																</button>
															)
														) : (
															<>
																{item[role] &&
																role !== "staff" &&
																item[role] !== user ? (
																	action.label === "View" && (
																		<button
																			key={actionIndex}
																			onClick={() => action.handler(item)}
																			className="flex-1 bg-white rounded-lg shadow-lg truncate"
																		>
																			{action.label}
																		</button>
																	)
																) : (
																	<button
																		key={actionIndex}
																		onClick={() => action.handler(item)}
																		className="flex-1 bg-white rounded-lg shadow-lg truncate"
																	>
																		{action.label}
																	</button>
																)}
															</>
														)
													) : (
														<>
															{item[role] &&
															role !== "staff" &&
															item[role] !== user ? (
																action.label === "View" && (
																	<button
																		key={actionIndex}
																		onClick={() => action.handler(item)}
																		className="flex-1 bg-white rounded-lg shadow-lg truncate"
																	>
																		{action.label}
																	</button>
																)
															) : (
																<button
																	key={actionIndex}
																	onClick={() => action.handler(item)}
																	className="flex-1 bg-white rounded-lg shadow-lg truncate"
																>
																	{action.label}
																</button>
															)}
														</>
													)}
												</Fragment>
											))}
										</td>
									) : (
										<td className="px-6 py-4">
											<div className="flex flex-col items-center space-y-2">
												{actions.map((action, actionIndex) => (
													<button
														key={actionIndex}
														onClick={() => action.handler(item)}
														className="w-full bg-white rounded-lg shadow-lg truncate"
													>
														{action.label}
													</button>
												))}
											</div>
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div
					className={`w-full my-10 ${
						data.length <= rowsPerPage ? "hidden" : ""
					}`}
				>
					<div className="relative flex justify-center items-center">
						{currentPage !== 1 && (
							<button
								onClick={() => setCurrentPage(currentPage - 1)}
								className="bg-sky-800 absolute left-0 text-white px-3 py-1 rounded-lg"
							>
								Previous
							</button>
						)}
						<div className="text-sky-800 absolute">
							Page {currentPage} of {totalPages}
						</div>
						{currentPage !== totalPages && (
							<button
								onClick={() => setCurrentPage(currentPage + 1)}
								className="bg-sky-800 absolute right-0 text-white px-3 py-1 rounded-lg"
							>
								Next
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReusableTable;
