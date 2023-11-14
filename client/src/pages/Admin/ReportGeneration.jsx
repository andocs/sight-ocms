import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getStaffAccounts } from "../../features/staff/staffSlice";
import {
	getMonthlyDoc,
	getMonthlyTech,
	getWeeklyDoc,
	getWeeklyTech,
	getInventoryReport,
	getWeeklyOrd,
	getMonthlyOrd,
	getBatches,
	getMonthlySales,
	getQuarterlySales,
} from "../../features/report/reportSlice";
import {
	PieChart,
	Pie,
	Sector,
	ResponsiveContainer,
	Cell,
	BarChart,
	Bar,
	Rectangle,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	LineChart,
	Line,
} from "recharts";

import { Tab } from "@headlessui/react";
import Spinner from "../../components/spinner.component";

const header = [
	{ title: "Staff Management" },
	{ title: "Inventory Management" },
];

const staffColumns = [
	{ header: "First Name", field: "fname" },
	{ header: "Last Name", field: "lname" },
	{ header: "Gender", field: "gender" },
	{ header: "Email", field: "email" },
	{ header: "Role", field: "role" },
];

const appointmentColumns = [
	{ header: "Appointment Date", field: "appointmentDate" },
	{ header: "Status", field: "status" },
	{ header: "First Name", field: "userFirstName" },
	{ header: "Last Name", field: "userLastName" },
	{ header: "Appointment Start", field: "appointmentStart" },
	{ header: "Appointment End", field: "appointmentEnd" },
	{ header: "Notes", field: "notes" },
];

const appointmentFields = [
	{ header: "Doctor Name", field: "doctor" },
	{ header: "Scheduled Appointments", field: "totalAppointments" },
	{ header: "Completed Appointments", field: "periodAppointments" },
	{ header: "Appointment Percentage", field: "percentageofAppointments" },
];

const orderColumns = [
	{ header: "Order Time", field: "orderTime" },
	{ header: "Status", field: "status" },
	{ header: "Patient First Name", field: "patientFirstName" },
	{ header: "Patient Last Name", field: "patientLastName" },
	{ header: "Lens", field: "lensName" },
	{ header: "Frame", field: "frameName" },
	{ header: "Other Items", field: "otherItems" },
	{ header: "Amount", field: "amount" },
];

const orderFields = [
	{ header: "Technician Name", field: "technician" },
	{ header: "Completion Rate", field: "completionRate" },
	{ header: "Ave. Completion Time", field: "avgCompletionTime" },
	{ header: "Total Orders", field: "totalOrders" },
	{ header: "Total Revenue", field: "totalRevenue" },
	{ header: "Completed Order", field: "completedOrders" },
];

const inventoryColumns = [
	{ header: "Item Name", field: "itemName" },
	{ header: "Vendor", field: "vendor" },
	{ header: "Category", field: "category" },
	{ header: "Total Value", field: "value" },
	{ header: "Quantity", field: "quantity" },
	{ header: "Price", field: "price" },
	{ header: "Stock Status", field: "stockStatus" },
];

const medicineColumns = [
	{ header: "Batch Number", field: "batchNumber" },
	{ header: "Item Name", field: "itemName" },
	{ header: "Vendor", field: "vendor" },
	{ header: "Expiration Date", field: "expirationDate" },
	{ header: "Batch Quantity", field: "batchQuantity" },
	{ header: "Total Value", field: "value" },
];

const salesColumns = [
	{ header: "Order Time", field: "orderTime" },
	{ header: "Status", field: "status" },
	{ header: "Patient First Name", field: "patientFirstName" },
	{ header: "Patient Last Name", field: "patientLastName" },
	{ header: "Item Name", field: "itemName" },
	{ header: "Quantity", field: "itemQuantity" },
	{ header: "Amount", field: "amount" },
];

const salesFields = [
	{ header: "Item Name", field: "itemName" },
	{ header: "Items Sold", field: "itemsSold" },
	{ header: "Movement Category", field: "movementCategory" },
	{ header: "Sales Velocity", field: "salesVelocity" },
	{ header: "Total Orders", field: "totalOrders" },
];

function ReportGeneration() {
	const reportActions = useSelector((state) => state.report);

	const {
		weeklyTech,
		weeklyDoc,
		monthlyTech,
		monthlyDoc,
		inventory,
		weeklyOrder,
		monthlyOrder,
		batches,
		quarterlySales,
		monthlySales,
	} = reportActions;

	const { staff, isLoading } = useSelector((state) => state.staff);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getStaffAccounts());
		dispatch(getMonthlyDoc());
		dispatch(getMonthlyTech());
		dispatch(getWeeklyDoc());
		dispatch(getWeeklyTech());

		dispatch(getInventoryReport());
		dispatch(getWeeklyOrd());
		dispatch(getMonthlyOrd());
		dispatch(getBatches());
		dispatch(getMonthlySales());
		dispatch(getQuarterlySales());
	}, [dispatch]);

	const renderActiveShape = (props) => {
		const RADIAN = Math.PI / 180;
		const {
			cx,
			cy,
			midAngle,
			innerRadius,
			outerRadius,
			startAngle,
			endAngle,
			fill,
			payload,
			percent,
			value,
		} = props;
		const sin = Math.sin(-RADIAN * midAngle);
		const cos = Math.cos(-RADIAN * midAngle);
		const sx = cx + (outerRadius + 10) * cos;
		const sy = cy + (outerRadius + 10) * sin;
		const mx = cx + (outerRadius + 30) * cos;
		const my = cy + (outerRadius + 30) * sin;
		const ex = mx + (cos >= 0 ? 1 : -1) * 22;
		const ey = my;
		const textAnchor = cos >= 0 ? "start" : "end";

		return (
			<g>
				<text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
					{payload.name}
				</text>
				<Sector
					cx={cx}
					cy={cy}
					innerRadius={innerRadius}
					outerRadius={outerRadius}
					startAngle={startAngle}
					endAngle={endAngle}
					fill={fill}
				/>
				<Sector
					cx={cx}
					cy={cy}
					startAngle={startAngle}
					endAngle={endAngle}
					innerRadius={outerRadius + 6}
					outerRadius={outerRadius + 10}
					fill={fill}
				/>
				<path
					d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
					stroke={fill}
					fill="none"
				/>
				<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					textAnchor={textAnchor}
					fill="#333"
				>{`${value} ${value > 1 ? "accounts" : "account"}`}</text>
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fill="#999"
				>
					{`(Rate ${(percent * 100).toFixed(2)}%)`}
				</text>
			</g>
		);
	};

	const [activeIndex, setActiveIndex] = useState(0);

	const onPieEnter = (_, index) => {
		setActiveIndex(index);
	};

	const COLORS = ["#0EA5E9", "#F97162", "#3EC08D", "#FF8042"];

	const data = [
		{
			name: "Doctor",
			value: staff.filter((role) => role.role === "doctor").length,
			color: COLORS[0], // Assign the first color
		},
		{
			name: "Technician",
			value: staff.filter((role) => role.role === "technician").length,
			color: COLORS[1], // Assign the second color
		},
		{
			name: "Staff",
			value: staff.filter((role) => role.role === "staff").length,
			color: COLORS[2], // Assign the third color
		},
	];

	if (isLoading || !staff || !weeklyTech || !weeklyDoc || !monthlyTech) {
		return <Spinner />;
	}

	function mapDataToColumns(data, columns, fields, headerText, dateEnd) {
		return data.map((item) => {
			const mappedItem = {
				headerText: headerText,
				dateStart: formatDate(new Date()),
			};
			if (dateEnd) {
				mappedItem.dateEnd = formatDate(dateEnd);
			}
			const headerFields = [];
			const newArr = [];
			Object.entries(item).forEach((array) => {
				if (Array.isArray(array[1])) {
					array[1].forEach((arr) => {
						const newObj = {};
						columns.forEach((column) => {
							if (fields) {
								if (column.field === "otherItems") {
									newObj["Other Items"] =
										Object.values(arr.otherItems)
											.map((items) => items.itemName)
											.filter((item) => item !== null)
											.join(", ") || "N/A";
								} else {
									newObj[column.header] = arr[column.field];
								}
							} else {
								if (column.field === "otherItems") {
									mappedItem["Other Items"] = item[column.field]
										? Object.entries(arr)
												.map((items) => {
													if (items[0] === "itemName") {
														return items[1];
													}
													return null;
												})
												.filter((item) => item !== null)
												.join(", ")
										: "N/A";
								}
							}
						});
						if (Object.keys(newObj).length > 0) {
							newArr.push(newObj);
						}
					});
				} else {
					if (fields) {
						const newObj = {};
						fields.forEach((column) => {
							newObj[column.header] = item[column.field];
						});
						headerFields.push(newObj);
					} else {
						columns.forEach((column) => {
							if (column.header !== "Other Items") {
								mappedItem[column.header] = item[column.field];
							} else {
								if (mappedItem[column.header] === undefined) {
									mappedItem[column.header] = "N/A";
								}
							}
						});
					}
				}
			});
			if (headerFields.length > 0) {
				mappedItem["header"] = headerFields;
			}
			if (newArr.length > 0) {
				mappedItem["data"] = newArr;
			}
			return mappedItem;
		});
	}

	const handleGenerateClick = (
		dataName,
		data,
		columns,
		fields,
		headerText,
		dateEnd
	) => {
		const name = dataName;
		const params = Object.keys(name)[0];
		const sessionData = mapDataToColumns(
			data,
			columns,
			fields,
			headerText,
			dateEnd
		);

		if (params !== "_reactName") {
			sessionStorage.setItem(`${params}`, JSON.stringify(sessionData));
			window.open(`/view-pdf/${params}`);
		}
	};

	function formatDate(date) {
		const months = [
			"Jan.",
			"Feb.",
			"Mar.",
			"Apr.",
			"May",
			"Jun.",
			"Jul.",
			"Aug.",
			"Sep.",
			"Oct.",
			"Nov.",
			"Dec.",
		];

		const month = months[date.getMonth()];
		const day = date.getDate();
		const year = date.getFullYear();

		return `${month} ${day}, ${year}`;
	}

	const now = new Date();
	const oneWeekAgo = new Date(now);
	oneWeekAgo.setDate(now.getDate() - 7);
	const oneMonthAgo = new Date(now);
	oneMonthAgo.setMonth(now.getMonth() - 1);
	const oneQuarterAgo = new Date(now);
	oneQuarterAgo.setDate(now.getDate() - 91);

	const compoundedMonthlyOrders = {};
	const compoundedWeeklyOrders = {};

	weeklyOrder &&
		weeklyOrder.forEach((order) => {
			const date = order.orderTime;
			const amountString = order.amount.replace(/[₱,]/g, "");
			const amountNumber = parseFloat(amountString);
			if (!compoundedWeeklyOrders[date]) {
				compoundedWeeklyOrders[date] = {
					amount: amountNumber,
					orderCount: 1,
					orderTime: date,
				};
			} else {
				compoundedWeeklyOrders[date].amount += amountNumber;
				compoundedWeeklyOrders[date].orderCount += 1;
			}
		});

	monthlyOrder &&
		monthlyOrder.forEach((order) => {
			const date = order.orderTime;
			const amountString = order.amount.replace(/[₱,]/g, "");
			const amountNumber = parseFloat(amountString);
			if (!compoundedMonthlyOrders[date]) {
				compoundedMonthlyOrders[date] = {
					amount: amountNumber,
					orderCount: 1,
					orderTime: date,
				};
			} else {
				compoundedMonthlyOrders[date].amount += amountNumber;
				compoundedMonthlyOrders[date].orderCount += 1;
			}
		});

	return (
		<>
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div className="w-full flex flex-row justify-between items-center">
						<p className="font-medium text-5xl">Charts & Report Generation</p>
					</div>
				</div>
			</div>
			<div>
				<div className="lg:w-5/6 p-8">
					<Tab.Group>
						<Tab.List className="flex space-x-1 rounded-xl bg-sky-900/20 p-1">
							{header.map((header) => (
								<Tab
									key={header.title}
									className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-sky-600 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ui-selected:bg-white  ui-selected:shadow ui-not-selected:text-sky-800 ui-not-selected:hover:bg-white/[0.12] ui-not-selected:hover:text-sky-600"
								>
									{header.title}
								</Tab>
							))}
						</Tab.List>
						<Tab.Panels className="mt-2 p-8 w-full h-full bg-white">
							{staff &&
								weeklyTech &&
								weeklyDoc &&
								monthlyTech &&
								inventory &&
								weeklyOrder &&
								monthlyOrder &&
								batches &&
								quarterlySales &&
								monthlySales && (
									<>
										{/* Staff */}
										<Tab.Panel className="w-full h-full">
											<div className="w-full mb-4">
												<p className="text-3xl font-medium">Staff Management</p>
											</div>
											<hr />

											{/* Monthly Doctor */}
											<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
												{monthlyDoc.length > 0 ? (
													<div className="bg-white h-[500px] p-6 ">
														<div className="flex flex-row justify-between z-50 relative">
															<p className="text-lg font-medium">
																Monthly Doctor Report
															</p>
															<div
																onClick={() =>
																	handleGenerateClick(
																		{ monthlyDoc },
																		monthlyDoc,
																		appointmentColumns,
																		appointmentFields,
																		"Monthly Doctor Report",
																		oneMonthAgo
																	)
																}
																className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	strokeWidth={1.5}
																	stroke="currentColor"
																	className="w-3 h-3"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																	/>
																</svg>
																<button onClick={handleGenerateClick}>
																	Generate Report
																</button>
															</div>
														</div>
														<hr />

														<div className="mt-6 flex flex-row justify-end relative px-12 text-center">
															<div className="absolute left-0 right-0">
																<p className="font-medium">
																	Appointments for the past month
																</p>
															</div>
															<p>
																{formatDate(oneMonthAgo)} - {formatDate(now)}
															</p>
														</div>

														<ResponsiveContainer
															width="100%"
															height="100%"
															className="flex flex-col justify-center items-center -mt-10"
														>
															<BarChart
																width={500}
																height={300}
																data={monthlyDoc}
																margin={{
																	top: 50,
																	right: 50,
																	left: 0,
																	bottom: 50,
																}}
															>
																<CartesianGrid strokeDasharray="3 3" />
																<XAxis dataKey="doctor" />
																<YAxis />
																<Tooltip />
																<Legend
																	align="center"
																	wrapperStyle={{ left: 20 }}
																/>
																<Bar
																	name="Completed"
																	dataKey="periodAppointments"
																	fill="#8884d8"
																	activeBar={
																		<Rectangle fill="pink" stroke="blue" />
																	}
																/>
																<Bar
																	name="Total"
																	dataKey="totalAppointments"
																	fill="#82ca9d"
																	activeBar={
																		<Rectangle fill="gold" stroke="purple" />
																	}
																/>
															</BarChart>
														</ResponsiveContainer>
													</div>
												) : (
													<>
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-start z-50 relative">
																<p className="text-lg font-medium">
																	Monthly Doctor Report
																</p>
															</div>
															<hr />

															<div className="flex flex-row h-full px-16 pt-4 pb-16 justify-evenly">
																<img src="/images/nodata.svg" alt="" />
																<div className="flex flex-col h-full justify-center">
																	<div className="text-center text-5xl font-bold z-50">
																		<p>Oops!</p>
																	</div>
																	<div className="text-center text-xl z-50">
																		<p>There is no data to display.</p>
																	</div>
																</div>
															</div>
														</div>
													</>
												)}
											</div>

											{/* 2x2 Grid */}
											<div className="mt-4 grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-4">
												{/* Staff Breakdown */}
												<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
													{staff.length > 0 ? (
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-between z-50 relative">
																<p className="text-lg font-medium">
																	Staff Composition Breakdown
																</p>
																<div
																	onClick={() =>
																		handleGenerateClick(
																			{ staff },
																			staff,
																			staffColumns,
																			null,
																			"List of Staff"
																		)
																	}
																	className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		strokeWidth={1.5}
																		stroke="currentColor"
																		className="w-3 h-3"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																		/>
																	</svg>
																	<button onClick={handleGenerateClick}>
																		Generate Report
																	</button>
																</div>
															</div>
															<hr />

															<ResponsiveContainer
																width="100%"
																height="100%"
																className="flex justify-center items-center -mt-10"
															>
																<PieChart width={400} height={400}>
																	<Pie
																		activeIndex={activeIndex}
																		activeShape={renderActiveShape}
																		data={data}
																		cx="40%"
																		cy="50%"
																		innerRadius={60}
																		outerRadius={80}
																		fill="#7dd3fc"
																		dataKey="value"
																		onMouseEnter={onPieEnter}
																	>
																		{data.map((entry, index) => (
																			<Cell
																				key={`cell-${index}`}
																				fill={entry.color}
																			/>
																		))}
																	</Pie>
																	<Legend
																		layout="vertical"
																		align="left"
																		verticalAlign="middle"
																	/>
																</PieChart>
															</ResponsiveContainer>
															<p className="text-center -mt-16">
																Percentage of staff according to their roles.
															</p>
														</div>
													) : (
														<>
															<div className="bg-white h-[500px] p-6">
																<div className="flex flex-row justify-start z-50 relative">
																	<p className="text-lg font-medium">
																		Staff Composition Breakdown
																	</p>
																</div>
																<hr />

																<div className="flex flex-col h-full px-16 pt-4 pb-16">
																	<img src="/images/nodata.svg" alt="" />
																	<div className="flex flex-col">
																		<div className="text-center text-5xl font-bold z-50">
																			<p>Oops!</p>
																		</div>
																		<div className="text-center text-xl z-50">
																			<p>There is no data to display.</p>
																		</div>
																	</div>
																</div>
															</div>
														</>
													)}
												</div>

												{/* Weekly Tech */}
												<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
													{weeklyTech.length > 0 ? (
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-between z-50 relative">
																<p className="text-lg font-medium">
																	Weekly Technician Report
																</p>
																<div
																	onClick={() =>
																		handleGenerateClick(
																			{ weeklyTech },
																			weeklyTech,
																			orderColumns,
																			orderFields,
																			"Weekly Technician Report",
																			oneWeekAgo
																		)
																	}
																	className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		strokeWidth={1.5}
																		stroke="currentColor"
																		className="w-3 h-3"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																		/>
																	</svg>
																	<button>Generate Report</button>
																</div>
															</div>

															<hr />
															<div className="mt-6 flex flex-row justify-between relative px-12 text-center">
																<p className="font-medium">
																	Orders for the past week
																</p>

																<p>
																	{formatDate(oneWeekAgo)} - {formatDate(now)}
																</p>
															</div>
															<ResponsiveContainer
																width="100%"
																height="100%"
																className="flex flex-col justify-center items-center -mt-8"
															>
																<BarChart
																	width={500}
																	height={300}
																	data={weeklyTech}
																	margin={{
																		top: 50,
																		right: 50,
																		bottom: 50,
																	}}
																>
																	<CartesianGrid strokeDasharray="3 3" />
																	<XAxis dataKey="technician" />
																	<YAxis />
																	<Tooltip />
																	<Legend
																		align="center"
																		wrapperStyle={{ left: 25 }}
																	/>
																	<Bar
																		name="Completed"
																		dataKey="completedOrders"
																		fill="#8884d8"
																		activeBar={
																			<Rectangle fill="pink" stroke="blue" />
																		}
																	/>
																	<Bar
																		name="Total"
																		dataKey="totalOrders"
																		fill="#82ca9d"
																		activeBar={
																			<Rectangle fill="gold" stroke="purple" />
																		}
																	/>
																</BarChart>
															</ResponsiveContainer>
														</div>
													) : (
														<>
															<div className="bg-white h-[500px] p-6">
																<div className="flex flex-row justify-start z-50 relative">
																	<p className="text-lg font-medium">
																		Weekly Technician Report
																	</p>
																</div>
																<hr />

																<div className="flex flex-col h-full px-16 pt-4 pb-16">
																	<img src="/images/nodata.svg" alt="" />
																	<div className="flex flex-col">
																		<div className="text-center text-5xl font-bold z-50">
																			<p>Oops!</p>
																		</div>
																		<div className="text-center text-xl z-50">
																			<p>There is no data to display.</p>
																		</div>
																	</div>
																</div>
															</div>
														</>
													)}
												</div>

												{/* Weekly Doc */}
												<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
													{weeklyDoc.length > 0 ? (
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-between z-50 relative">
																<p className="text-lg font-medium">
																	Weekly Doctor Report
																</p>
																<div
																	onClick={() =>
																		handleGenerateClick(
																			{ weeklyDoc },
																			weeklyDoc,
																			appointmentColumns,
																			appointmentFields,
																			"Weekly Doctor Report",
																			oneWeekAgo
																		)
																	}
																	className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		strokeWidth={1.5}
																		stroke="currentColor"
																		className="w-3 h-3"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																		/>
																	</svg>
																	<button>Generate Report</button>
																</div>
															</div>

															<hr />
															<div className="mt-6 flex flex-row justify-between relative px-12 text-center">
																<p className="font-medium">
																	Appointments for the past week
																</p>

																<p>
																	{formatDate(oneWeekAgo)} - {formatDate(now)}
																</p>
															</div>
															<ResponsiveContainer
																width="100%"
																height="100%"
																className="flex flex-col justify-center items-center -mt-8"
															>
																<BarChart
																	width={500}
																	height={300}
																	data={weeklyDoc}
																	margin={{
																		top: 50,
																		right: 50,
																		left: 0,
																		bottom: 50,
																	}}
																>
																	<CartesianGrid strokeDasharray="3 3" />
																	<XAxis dataKey="doctor" />
																	<YAxis />
																	<Tooltip />
																	<Legend
																		align="center"
																		wrapperStyle={{ left: 30 }}
																	/>
																	<Bar
																		name="Completed"
																		dataKey="periodAppointments"
																		fill="#8884d8"
																		activeBar={
																			<Rectangle fill="pink" stroke="blue" />
																		}
																	/>
																	<Bar
																		name="Total"
																		dataKey="totalAppointments"
																		fill="#82ca9d"
																		activeBar={
																			<Rectangle fill="gold" stroke="purple" />
																		}
																	/>
																</BarChart>
															</ResponsiveContainer>
														</div>
													) : (
														<>
															<div className="bg-white h-[500px] p-6">
																<div className="flex flex-row justify-start z-50 relative">
																	<p className="text-lg font-medium">
																		Weekly Doctor Report
																	</p>
																</div>
																<hr />

																<div className="flex flex-col h-full px-16 pt-4 pb-16">
																	<img src="/images/nodata.svg" alt="" />
																	<div className="flex flex-col">
																		<div className="text-center text-5xl font-bold z-50">
																			<p>Oops!</p>
																		</div>
																		<div className="text-center text-xl z-50">
																			<p>There is no data to display.</p>
																		</div>
																	</div>
																</div>
															</div>
														</>
													)}
												</div>

												{/* Monthly Tech */}
												<div className="w-full overflow-hidden  shadow-xl border-gray-200 border mt-4">
													{monthlyTech.length > 0 ? (
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-between z-50 relative">
																<p className="text-lg font-medium">
																	Monthly Technician Report
																</p>
																<div
																	onClick={() =>
																		handleGenerateClick(
																			{ monthlyTech },
																			monthlyTech,
																			orderColumns,
																			orderFields,
																			"Monthly Technician Report",
																			oneMonthAgo
																		)
																	}
																	className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		strokeWidth={1.5}
																		stroke="currentColor"
																		className="w-3 h-3"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																		/>
																	</svg>
																	<button>Generate Report</button>
																</div>
															</div>

															<hr />
															<div className="mt-6 flex flex-row justify-between relative px-12 text-center">
																<p className="font-medium">
																	Orders for the past month
																</p>

																<p>
																	{formatDate(oneMonthAgo)} - {formatDate(now)}
																</p>
															</div>
															<ResponsiveContainer
																width="100%"
																height="100%"
																className="flex flex-col justify-center items-center -mt-8"
															>
																<BarChart
																	width={500}
																	height={300}
																	data={monthlyTech}
																	margin={{
																		top: 50,
																		right: 50,

																		bottom: 50,
																	}}
																>
																	<CartesianGrid strokeDasharray="3 3" />
																	<XAxis dataKey="technician" />
																	<YAxis />
																	<Tooltip />
																	<Legend wrapperStyle={{ left: 25 }} />
																	<Bar
																		name="Completed"
																		dataKey="completedOrders"
																		fill="#8884d8"
																		activeBar={
																			<Rectangle fill="pink" stroke="blue" />
																		}
																	/>
																	<Bar
																		name="Total"
																		dataKey="totalOrders"
																		fill="#82ca9d"
																		activeBar={
																			<Rectangle fill="gold" stroke="purple" />
																		}
																	/>
																</BarChart>
															</ResponsiveContainer>
														</div>
													) : (
														<>
															<div className="bg-white h-[500px] p-6">
																<div className="flex flex-row justify-start z-50 relative">
																	<p className="text-lg font-medium">
																		Monthly Technician Report
																	</p>
																</div>
																<hr />

																<div className="flex flex-col h-full px-16 pt-4 pb-16">
																	<img src="/images/nodata.svg" alt="" />
																	<div className="flex flex-col">
																		<div className="text-center text-5xl font-bold z-50">
																			<p>Oops!</p>
																		</div>
																		<div className="text-center text-xl z-50">
																			<p>There is no data to display.</p>
																		</div>
																	</div>
																</div>
															</div>
														</>
													)}
												</div>
											</div>
										</Tab.Panel>

										{/* Inventory */}
										<Tab.Panel className="w-full h-full">
											<div className="w-full mb-4">
												<p className="text-3xl font-medium">
													Inventory Management
												</p>
											</div>
											<hr />

											{/* Inventory Report */}
											<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
												{inventory.length > 0 ? (
													<div className="bg-white h-[500px] p-6 ">
														<div className="flex flex-row justify-between z-50 relative">
															<p className="text-lg font-medium">
																Inventory Report
															</p>
															<div
																onClick={() =>
																	handleGenerateClick(
																		{ inventory },
																		inventory,
																		inventoryColumns,
																		null,
																		"Inventory"
																	)
																}
																className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	strokeWidth={1.5}
																	stroke="currentColor"
																	className="w-3 h-3"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																	/>
																</svg>
																<button onClick={handleGenerateClick}>
																	Generate Report
																</button>
															</div>
														</div>
														<hr />

														<div className="mt-6 flex flex-row justify-end relative px-12 text-center mb-6">
															<div className="absolute left-0 right-0">
																<p className="font-medium">
																	Inventory values as of {formatDate(now)}
																</p>
															</div>
														</div>

														<ResponsiveContainer
															width="100%"
															height="100%"
															className="flex flex-col justify-center items-center -mt-10"
														>
															<BarChart
																width={500}
																height={300}
																data={inventory}
																margin={{
																	top: 50,
																	right: 50,
																	left: 0,
																	bottom: 50,
																}}
															>
																<CartesianGrid strokeDasharray="3 3" />
																<XAxis dataKey="itemName" />
																<YAxis />
																<Tooltip />
																<Legend
																	align="center"
																	wrapperStyle={{ left: 20 }}
																/>
																<Bar
																	name="Quantity"
																	dataKey="quantity"
																	fill="#8884d8"
																	activeBar={
																		<Rectangle fill="pink" stroke="blue" />
																	}
																/>
															</BarChart>
														</ResponsiveContainer>
													</div>
												) : (
													<>
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-start z-50 relative">
																<p className="text-lg font-medium">
																	Inventory Report
																</p>
															</div>
															<hr />

															<div className="flex flex-row h-full px-16 pt-4 pb-16 justify-evenly">
																<img src="/images/nodata.svg" alt="" />
																<div className="flex flex-col h-full justify-center">
																	<div className="text-center text-5xl font-bold z-50">
																		<p>Oops!</p>
																	</div>
																	<div className="text-center text-xl z-50">
																		<p>There is no data to display.</p>
																	</div>
																</div>
															</div>
														</div>
													</>
												)}
											</div>

											{/* 2x1 Grid */}
											<div className="mt-4 grid grid-cols-2 grid-rows-1 gap-x-8 gap-y-4">
												{/* Weekly Order */}
												<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
													{weeklyOrder.length > 0 ? (
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-between z-50 relative">
																<p className="text-lg font-medium">
																	Weekly Order History Report
																</p>
																<div
																	onClick={() =>
																		handleGenerateClick(
																			{ weeklyOrder },
																			weeklyOrder,
																			orderColumns,
																			null,
																			"Weekly Order History Report",
																			oneWeekAgo
																		)
																	}
																	className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		strokeWidth={1.5}
																		stroke="currentColor"
																		className="w-3 h-3"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																		/>
																	</svg>
																	<button>Generate Report</button>
																</div>
															</div>

															<hr />
															<div className="mt-6 flex flex-row justify-between relative px-12 text-center">
																<p className="font-medium">
																	Order History for the past week
																</p>

																<p>
																	{formatDate(oneWeekAgo)} - {formatDate(now)}
																</p>
															</div>
															<ResponsiveContainer
																width="100%"
																height="100%"
																className="flex flex-col justify-center items-center -mt-8"
															>
																<LineChart
																	margin={{
																		top: 50,
																		bottom: 50,
																	}}
																	data={Object.values(compoundedWeeklyOrders)}
																>
																	<CartesianGrid strokeDasharray="3 3" />
																	<XAxis dataKey="orderTime" />
																	<YAxis yAxisId="left" orientation="left" />
																	<YAxis yAxisId="right" orientation="right" />
																	<Tooltip />
																	<Legend align="center" />
																	<Line
																		type="monotone"
																		dataKey="amount"
																		name="Order Amount"
																		stroke="#8884d8"
																		yAxisId="left"
																	/>
																	<Line
																		type="monotone"
																		dataKey="orderCount"
																		name="Order Count"
																		stroke="#82ca9d"
																		yAxisId="right"
																	/>
																</LineChart>
															</ResponsiveContainer>
														</div>
													) : (
														<>
															<div className="bg-white h-[500px] p-6">
																<div className="flex flex-row justify-start z-50 relative">
																	<p className="text-lg font-medium">
																		Weekly Order History Report
																	</p>
																</div>
																<hr />

																<div className="flex flex-col h-full px-16 pt-4 pb-16">
																	<img src="/images/nodata.svg" alt="" />
																	<div className="flex flex-col">
																		<div className="text-center text-5xl font-bold z-50">
																			<p>Oops!</p>
																		</div>
																		<div className="text-center text-xl z-50">
																			<p>There is no data to display.</p>
																		</div>
																	</div>
																</div>
															</div>
														</>
													)}
												</div>

												{/* Monthly Order */}
												<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
													{monthlyOrder.length > 0 ? (
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-between z-50 relative">
																<p className="text-lg font-medium">
																	Monthly Order History Report
																</p>
																<div
																	onClick={() =>
																		handleGenerateClick(
																			{ monthlyOrder },
																			monthlyOrder,
																			orderColumns,
																			null,
																			"Monthly Order History Report",
																			oneMonthAgo
																		)
																	}
																	className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		strokeWidth={1.5}
																		stroke="currentColor"
																		className="w-3 h-3"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																		/>
																	</svg>
																	<button>Generate Report</button>
																</div>
															</div>

															<hr />
															<div className="mt-6 flex flex-row justify-between relative px-12 text-center">
																<p className="font-medium">
																	Order History for the past month
																</p>

																<p>
																	{formatDate(oneMonthAgo)} - {formatDate(now)}
																</p>
															</div>
															<ResponsiveContainer
																width="100%"
																height="100%"
																className="flex flex-col justify-center items-center -mt-8"
															>
																<LineChart
																	margin={{
																		top: 50,
																		bottom: 50,
																	}}
																	data={Object.values(compoundedMonthlyOrders)}
																>
																	<CartesianGrid strokeDasharray="3 3" />
																	<XAxis dataKey="orderTime" />
																	<YAxis yAxisId="left" orientation="left" />
																	<YAxis yAxisId="right" orientation="right" />
																	<Tooltip />
																	<Legend align="center" />
																	<Line
																		type="monotone"
																		dataKey="amount"
																		name="Order Amount"
																		stroke="#8884d8"
																		yAxisId="left"
																	/>
																	<Line
																		type="monotone"
																		dataKey="orderCount"
																		name="Order Count"
																		stroke="#82ca9d"
																		yAxisId="right"
																	/>
																</LineChart>
															</ResponsiveContainer>
														</div>
													) : (
														<>
															<div className="bg-white h-[500px] p-6">
																<div className="flex flex-row justify-start z-50 relative">
																	<p className="text-lg font-medium">
																		Monthly Order History Report
																	</p>
																</div>
																<hr />

																<div className="flex flex-col h-full px-16 pt-4 pb-16">
																	<img src="/images/nodata.svg" alt="" />
																	<div className="flex flex-col">
																		<div className="text-center text-5xl font-bold z-50">
																			<p>Oops!</p>
																		</div>
																		<div className="text-center text-xl z-50">
																			<p>There is no data to display.</p>
																		</div>
																	</div>
																</div>
															</div>
														</>
													)}
												</div>
											</div>

											{/* Batches */}
											<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
												{batches.length > 0 ? (
													<div className="bg-white p-6">
														<div className="flex flex-row justify-between z-50 relative">
															<p className="text-lg font-medium">
																Medicine Report
															</p>
															<div
																onClick={() =>
																	handleGenerateClick(
																		{ batches },
																		batches,
																		medicineColumns,
																		null,
																		"Medicine Report"
																	)
																}
																className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	strokeWidth={1.5}
																	stroke="currentColor"
																	className="w-3 h-3"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																	/>
																</svg>
																<button onClick={handleGenerateClick}>
																	Generate Report
																</button>
															</div>
														</div>
														<hr />

														<div className="mt-6 flex flex-row justify-end relative px-12 text-center mb-6">
															<div className="absolute left-0 right-0">
																<p className="font-medium">
																	Medicine values as of {formatDate(now)}
																</p>
															</div>
														</div>
														<div className="bg-white overflow-y-auto overflow-x-hidden">
															<table className="w-full">
																<thead className="bg-white text-sky-800 border-b-2 border-blue-600">
																	<tr>
																		{medicineColumns.map((column) => (
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
																<tbody>
																	{batches.map((item, index) => (
																		<tr key={index}>
																			{medicineColumns.map((column) => (
																				<td
																					key={column.field}
																					className="min-w-[115px] max-w-[115px] p-4 text-left break-words"
																				>
																					{item[column.field] || "N/A"}
																				</td>
																			))}
																		</tr>
																	))}
																</tbody>
															</table>
														</div>
													</div>
												) : (
													<>
														<div className="bg-white p-6">
															<div className="flex flex-row justify-start z-50 relative">
																<p className="text-lg font-medium">
																	Medicine Report
																</p>
															</div>
															<hr />

															<div className="flex flex-row h-full px-16 pt-4 pb-16 justify-evenly">
																<img src="/images/nodata.svg" alt="" />
																<div className="flex flex-col h-full justify-center">
																	<div className="text-center text-5xl font-bold z-50">
																		<p>Oops!</p>
																	</div>
																	<div className="text-center text-xl z-50">
																		<p>There is no data to display.</p>
																	</div>
																</div>
															</div>
														</div>
													</>
												)}
											</div>

											{/* 2x1 Grid */}
											<div className="mt-4 grid grid-cols-2 grid-rows-1 gap-x-8 gap-y-4">
												{/* Quarterly Sales Velocity */}
												<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
													{quarterlySales.length > 0 ? (
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-between z-50 relative">
																<p className="text-lg font-medium">
																	Quarterly Sales Velocity Report
																</p>
																<div
																	onClick={() =>
																		handleGenerateClick(
																			{ quarterlySales },
																			quarterlySales,
																			salesColumns,
																			salesFields,
																			"Quarterly Sales History Report",
																			oneQuarterAgo
																		)
																	}
																	className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		strokeWidth={1.5}
																		stroke="currentColor"
																		className="w-3 h-3"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																		/>
																	</svg>
																	<button>Generate Report</button>
																</div>
															</div>

															<hr />
															<div className="mt-6 flex flex-row justify-between relative px-12 text-center">
																<p className="font-medium">
																	Item Velocity for the past quarter
																</p>

																<p>
																	{formatDate(oneQuarterAgo)} -{" "}
																	{formatDate(now)}
																</p>
															</div>
															<ResponsiveContainer
																width="100%"
																height="100%"
																className="flex flex-col justify-center items-center -mt-8"
															>
																<LineChart
																	margin={{
																		top: 50,
																		bottom: 50,
																	}}
																	data={quarterlySales}
																>
																	<CartesianGrid strokeDasharray="3 3" />
																	<XAxis dataKey="itemName" />
																	<YAxis yAxisId="left" orientation="left" />
																	<YAxis yAxisId="right" orientation="right" />
																	<Tooltip />
																	<Legend align="center" />
																	<Line
																		type="monotone"
																		dataKey="itemsSold"
																		name="Items Sold"
																		stroke="#8884d8"
																		yAxisId="left"
																	/>
																	<Line
																		type="monotone"
																		dataKey="salesVelocity"
																		name="Sales Velocity"
																		stroke="#82ca9d"
																		yAxisId="right"
																	/>
																</LineChart>
															</ResponsiveContainer>
														</div>
													) : (
														<>
															<div className="bg-white h-[500px] p-6">
																<div className="flex flex-row justify-start z-50 relative">
																	<p className="text-lg font-medium">
																		Quarterly Sales Velocity Report
																	</p>
																</div>
																<hr />

																<div className="flex flex-col h-full px-16 pt-4 pb-16">
																	<img src="/images/nodata.svg" alt="" />
																	<div className="flex flex-col">
																		<div className="text-center text-5xl font-bold z-50">
																			<p>Oops!</p>
																		</div>
																		<div className="text-center text-xl z-50">
																			<p>There is no data to display.</p>
																		</div>
																	</div>
																</div>
															</div>
														</>
													)}
												</div>
												{/* Monthly Sales Velocity */}
												<div className="w-full overflow-hidden shadow-xl border-gray-200 border mt-4">
													{monthlySales.length > 0 ? (
														<div className="bg-white h-[500px] p-6">
															<div className="flex flex-row justify-between z-50 relative">
																<p className="text-lg font-medium">
																	Monthly Sales Velocity Report
																</p>
																<div
																	onClick={() =>
																		handleGenerateClick(
																			{ monthlySales },
																			monthlySales,
																			salesColumns,
																			salesFields,
																			"Monthly Sales Velocity Report",
																			oneMonthAgo
																		)
																	}
																	className="flex flex-row items-center align-middle space-x-1 cursor-pointer hover:text-sky-600"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		strokeWidth={1.5}
																		stroke="currentColor"
																		className="w-3 h-3"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
																		/>
																	</svg>
																	<button>Generate Report</button>
																</div>
															</div>

															<hr />
															<div className="mt-6 flex flex-row justify-between relative px-12 text-center">
																<p className="font-medium">
																	Item Velocity for the past month
																</p>

																<p>
																	{formatDate(oneMonthAgo)} - {formatDate(now)}
																</p>
															</div>
															<ResponsiveContainer
																width="100%"
																height="100%"
																className="flex flex-col justify-center items-center -mt-8"
															>
																<LineChart
																	margin={{
																		top: 50,
																		bottom: 50,
																	}}
																	data={monthlySales}
																>
																	<CartesianGrid strokeDasharray="3 3" />
																	<XAxis dataKey="itemName" />
																	<YAxis yAxisId="left" orientation="left" />
																	<YAxis yAxisId="right" orientation="right" />
																	<Tooltip />
																	<Legend align="center" />
																	<Line
																		type="monotone"
																		dataKey="itemsSold"
																		name="Items Sold"
																		stroke="#8884d8"
																		yAxisId="left"
																	/>
																	<Line
																		type="monotone"
																		dataKey="salesVelocity"
																		name="Sales Velocity"
																		stroke="#82ca9d"
																		yAxisId="right"
																	/>
																</LineChart>
															</ResponsiveContainer>
														</div>
													) : (
														<>
															<div className="bg-white h-[500px] p-6">
																<div className="flex flex-row justify-start z-50 relative">
																	<p className="text-lg font-medium">
																		Monthly Sales Velocity Report
																	</p>
																</div>
																<hr />

																<div className="flex flex-col h-full px-16 pt-4 pb-16">
																	<img src="/images/nodata.svg" alt="" />
																	<div className="flex flex-col">
																		<div className="text-center text-5xl font-bold z-50">
																			<p>Oops!</p>
																		</div>
																		<div className="text-center text-xl z-50">
																			<p>There is no data to display.</p>
																		</div>
																	</div>
																</div>
															</div>
														</>
													)}
												</div>
											</div>
										</Tab.Panel>
									</>
								)}
						</Tab.Panels>
					</Tab.Group>
				</div>
			</div>
		</>
	);
}

export default ReportGeneration;
