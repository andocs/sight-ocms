import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getStaffAccounts } from "../../features/staff/staffSlice";
import {
	getMonthlyDoc,
	getMonthlyTech,
	getWeeklyDoc,
	getWeeklyTech,
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
} from "recharts";

import { Tab } from "@headlessui/react";
import Spinner from "../../components/spinner.component";

const header = [
	{ title: "Staff Management" },
	{ title: "Inventory Management" },
	{ title: "Maintenance Management" },
	{ title: "Audit Trail/Logs" },
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
	{ header: "Completed Appointments", field: "monthlyAppointments" },
	{ header: "Appointment Percentage", field: "percentageofAppointments" },
];

const orderColumns = [
	{ header: "Order Time", field: "orderTime" },
	{ header: "Status", field: "status" },
	{ header: "Patient First Name", field: "patientFirstName" },
	{ header: "Patient Last Name", field: "patientLastName" },
	{ header: "Lens", field: "lensName" },
	{ header: "Frame", field: "frameName" },
	{ header: "Amount", field: "amount" },
];

const orderFields = [
	{ header: "Technician Name", field: "technician" },
	{ header: "Completed Order", field: "completedOrders" },
	{ header: "Total Orders", field: "totalAppointments" },
	{ header: "Total Revenue", field: "totalRevenue" },
	{ header: "Ave. Completion Time", field: "avgCompletionTime" },
	{ header: "Completion Rate", field: "completionRate" },
];

function ReportGeneration() {
	const reportActions = useSelector((state) => state.report);

	const { weeklyTech, weeklyDoc, monthlyTech, monthlyDoc } = reportActions;

	const { staff, isLoading } = useSelector((state) => state.staff);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getStaffAccounts());
		dispatch(getMonthlyDoc());
		dispatch(getMonthlyTech());
		dispatch(getWeeklyDoc());
		dispatch(getWeeklyTech());
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

	function mapDataToColumns(data, columns, fields, headerText) {
		return data.map((item) => {
			const mappedItem = {
				headerText: headerText,
			};
			const headerFields = [];
			const newArr = [];
			Object.values(item).forEach((array) => {
				if (Array.isArray(array)) {
					array.forEach((arr) => {
						const newObj = {};
						columns.forEach((column) => {
							newObj[column.header] = arr[column.field];
						});
						newArr.push(newObj);
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
							mappedItem[column.header] = item[column.field];
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

	const handleGenerateClick = (dataName, data, columns, fields, headerText) => {
		const name = dataName;
		const params = Object.keys(name)[0];
		console.log(data);
		const sessionData = mapDataToColumns(data, columns, fields, headerText);

		if (params !== "_reactName") {
			console.log(params);
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
							{staff && weeklyTech && weeklyDoc && monthlyTech && (
								<Tab.Panel className="w-full h-full">
									<div className="w-full mb-4">
										<p className="text-3xl font-medium">Staff Management</p>
									</div>
									<hr />

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
																"Monthly Doctor Report"
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
														{formatDate(now)} - {formatDate(oneMonthAgo)}
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
															dataKey="monthlyAppointments"
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

									<div className="mt-4 grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-4">
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
																	"Weekly Technician Report"
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
															{formatDate(now)} - {formatDate(oneWeekAgo)}
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
																	"Weekly Doctor Report"
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
															{formatDate(now)} - {formatDate(oneWeekAgo)}
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
																dataKey="weeklyAppointments"
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
																	"Monthly Technician Report"
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
															{formatDate(now)} - {formatDate(oneMonthAgo)}
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
							)}
						</Tab.Panels>
					</Tab.Group>
				</div>
			</div>
		</>
	);
}

export default ReportGeneration;
