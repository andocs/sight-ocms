import { useState } from "react";

const ReusableTable = ({ data, columns, actions }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 6; // Number of rows to display per page

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
		return <p>No data available.</p>;
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

						<tbody className="bg-cyan-100 text-sky-800 p-4 relative z-0 text-left">
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
											) : (
												item[column.field]
											)}
										</td>
									))}
									{actions.length !== 1 ? (
										<td className="px-6 py-4 flex space-x-2">
											{actions.map((action, actionIndex) => (
												<button
													key={actionIndex}
													onClick={() => action.handler(item)}
													className="flex-1 bg-white rounded-lg shadow-lg truncate"
												>
													{action.label}
												</button>
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
