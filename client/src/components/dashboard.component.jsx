import { useState, useEffect } from "react";

function DashComponent({ props, headerClick, displayClick, status, table }) {
	const [divHeight, setDivHeight] = useState(0);

	useEffect(() => {
		const wrapper = document.getElementById("status");
		const header =
			document.getElementById("header") && document.getElementById("header");
		const headHeight = header && header.clientHeight;
		const wrapperHeight = wrapper.clientHeight;
		if (wrapperHeight && headHeight) {
			setDivHeight(wrapperHeight - headHeight);
		} else {
			setDivHeight(wrapperHeight);
		}
	}, []);

	const onHeaderClick = (e) => {
		e.preventDefault();
		headerClick();
	};
	const onDisplayClick = (e) => {
		e.preventDefault();
		displayClick();
	};

	return (
		<>
			<div className="w-full bg-white shadow-sm border-b border-gray-200">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">{props.header.title}</p>
					</div>
					<div>
						<button
							onClick={onHeaderClick}
							className={`w-52 bg-${props.header.color}-950 text-white rounded-lg text-base py-2 px-8 hover:bg-${props.header.color}-900`}
						>
							{props.header.button}
						</button>
					</div>
				</div>

				<div></div>
			</div>
			<div
				className={`xl:w-5/6 w-full p-8 flex flex-col ${props.textcolor} space-y-8 mb-16`}
			>
				<div
					className={`p-8 rounded-md w-full ${props.display.role}bg space-y-6 shadow-xl border-gray-200 border`}
				>
					<div className="w-full">
						<p className="font-medium text-2xl">Welcome!</p>
					</div>

					<div className="w-full">
						<p className=" font-medium text-4xl">{props.username}.</p>
					</div>
					<div className="w-2/5">
						<p className="font-medium text-lg">{props.text}</p>
					</div>

					<div className="w-2/5">
						<button
							onClick={onDisplayClick}
							className={`w-2/3 mt-2 bg-${props.display.color}-800 text-white rounded-lg text-base py-2 px-8 hover:bg-${props.display.color}-700`}
						>
							{props.display.button}
						</button>
					</div>
				</div>

				<div className="flex flex-row space-x-8 w-full text-sky-800">
					<div className="flex flex-col w-1/2">
						<div className="w-full mb-4 px-4">
							<p className="font-medium text-2xl">Status</p>
						</div>
						<div
							id="status"
							className="flex flex-col h-full w-full space-y-4 lg:space-y-0 lg:grid lg:gap-4 lg:grid-cols-2 lg:grid-rows-2"
						>
							{status.map((field, fieldIndex) => (
								<div
									key={fieldIndex}
									className="p-6 flex flex-row border-gray-200 border shadow-lg rounded-md bg-white justify-between"
								>
									<div className="flex flex-col w-1/2 justify-center">
										<div>
											<p className="font-medium text-2xl text-sky-600">
												{field.number}
											</p>
										</div>
										<div className="w-auto">
											<p className="font-medium text-base text-sky-800 truncate">
												{field.text}
											</p>
										</div>
									</div>
									<div className="flex flex-col justify-center">
										<div className="bg-sky-600 rounded-md px-4 py-6 ">
											<p className="font-medium text-2xl text-white">
												{field.svg}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="w-2/3 text-sky-800">
						<div className="w-full mb-4">
							<p className="font-medium text-2xl">{table.header}</p>
						</div>

						<div className="w-full overflow-hidden rounded-md shadow-xl border-gray-200 border">
							<div className="bg-white">
								<table
									id="header"
									className="w-full border-b-2 border-blue-600"
								>
									<thead className="bg-white text-sky-800 ">
										<tr>
											{table.columns.map((column) => (
												<th
													key={column.field}
													style={{ width: "115px" }}
													className="p-4 text-left font-medium"
												>
													{column.header}
												</th>
											))}
										</tr>
									</thead>
								</table>
							</div>
							{table.data.length > 0 ? (
								<div
									style={{ maxHeight: `${divHeight}px` }}
									className="bg-white overflow-y-auto overflow-x-hidden"
								>
									<table className="w-full">
										<tbody>
											{table.data.map((item, index) => (
												<tr key={index}>
													{table.columns.map((column) => (
														<td
															key={column.field}
															className="min-w-[115px] max-w-[115px]  p-4 text-left"
														>
															{column.field === "orderTime"
																? new Date(item[column.field]).toLocaleString(
																		"en-US",
																		{
																			month: "long",
																			day: "numeric",
																			year: "numeric",
																		}
																  )
																: item[column.field] || "N/A"}
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<>
									<div
										className="flex flex-row-reverse justify-evenly items-center bg-white p-8"
										style={{
											height: `${divHeight}px`,
											maxHeight: `${divHeight}px`,
										}}
									>
										<div className="flex flex-col">
											<div className="text-center text-5xl font-bold z-50">
												<p>Oops!</p>
											</div>
											<div className="text-center text-xl z-50">
												<p>There is no data to display.</p>
											</div>
										</div>
										<img className="h-full" src="/images/nodata.svg" alt="" />
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default DashComponent;
