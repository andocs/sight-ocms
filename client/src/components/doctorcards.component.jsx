import { useState } from "react";

function DoctorCards({ props, onClick }) {
	const [isFlipped, setIsFlipped] = useState(false);
	const [isSchedule, setIsSchedule] = useState(false);
	const [isBreak, setIsBreak] = useState(false);

	const [isHovered, setIsHovered] = useState(false);

	const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
	const [currentBreakIndex, setCurrentBreakIndex] = useState(0);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	const handleScheduleClick = () => {
		setIsFlipped(true);

		setIsSchedule(true);
	};

	const handleScheduleExit = () => {
		setIsFlipped(false);
		setTimeout(() => {
			setIsSchedule(false);
			setCurrentScheduleIndex(0);
		}, 500);
	};

	const goToNextDay = () => {
		if (currentScheduleIndex < props.schedule.length - 1) {
			setCurrentScheduleIndex(currentScheduleIndex + 1);
		}
	};

	const goToPreviousDay = () => {
		if (currentScheduleIndex > 0) {
			setCurrentScheduleIndex(currentScheduleIndex - 1);
		}
	};

	const handleSelect = (e) => {
		e.preventDefault();
		onClick(props);
	};

	const handleBreakClick = () => {
		setIsFlipped(true);
		setIsBreak(true);
	};

	const handleBreakExit = () => {
		setIsFlipped(false);
		setTimeout(() => {
			setIsBreak(false);
			setCurrentBreakIndex(0);
		}, 500);
	};

	const goToNextBreak = () => {
		if (currentBreakIndex < props.breaks.length - 1) {
			setCurrentBreakIndex(currentBreakIndex + 1);
		}
	};

	const goToPreviousBreak = () => {
		if (currentBreakIndex > 0) {
			setCurrentBreakIndex(currentBreakIndex - 1);
		}
	};

	return (
		<div className="w-72 h-72 mx-4 rounded-xl mb-8 card-container">
			<div
				className={`card${
					isFlipped ? " flip" : ""
				} shadow-xl border-gray-200 border w-full rounded-xl doc1`}
			>
				<div className="shadow-xl card-front">
					<div
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						className=" transition-all h-full rounded-xl relative z-0 hover:bg-sky-300 hover:bg-opacity-50"
					>
						{isHovered && (
							<div className="absolute rounded-t-xl inset-0 flex items-center justify-center">
								<div className="text-white space-y-1 justify-center flex flex-col text-center">
									<button
										onClick={handleScheduleClick}
										className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-full"
									>
										View Schedule
									</button>
									{props.breaks && props.breaks.length > 0 && (
										<>
											<p>or</p>
											<button
												onClick={handleBreakClick}
												className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-full"
											>
												View Breaks
											</button>
										</>
									)}
								</div>
							</div>
						)}
					</div>

					<div
						className={`flex flex-col bg-sky-600 space-y-3 -mt-4 pt-4 relative z-50 shadow-xl rounded-b-xl items-center justify-center ${
							!onClick && "pb-5"
						}`}
					>
						<div className="text-white text-center">
							<p className="text-lg font-semibold">Dr. {props.name}</p>
						</div>
						<div className="bg-white rounded-full text-sky-800 w-fit py-1 px-4 justify-center text-center">
							<p className="text-md uppercase font-semibold">Opthalmologist</p>
						</div>
						{onClick && (
							<div className="relative rounded-b-xl w-full h-10">
								<div className="absolute h-full w-full text-white flex flex-row justify-between">
									<button
										disabled={isFlipped}
										onClick={handleScheduleClick}
										className="hover:bg-sky-500 border-r border-gray-200 rounded-bl-xl px-4 w-1/2 text-sm font-semibold"
									>
										View Schedule
									</button>

									<button
										disabled={isFlipped}
										onClick={handleSelect}
										className="hover:bg-sky-500 rounded-br-xl px-4 w-1/2 text-sm font-semibold"
									>
										Select
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="card-back bg-white rounded-t-xl">
					{isSchedule &&
					!isBreak &&
					props.schedule &&
					props.schedule.length > 0 ? (
						<>
							<div className="flex flex-col h-full p-5">
								<div className="flex flex-row justify-between pb-2">
									<div className="text-sky-800">
										<label
											className="cursor-pointer"
											onClick={handleScheduleExit}
											htmlFor=""
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</label>
									</div>

									<div className="flex flex-row">
										<label
											className={`cursor-pointer ${
												currentScheduleIndex === 0 && "hidden"
											}`}
											onClick={goToPreviousDay}
											htmlFor=""
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15.75 19.5L8.25 12l7.5-7.5"
												/>
											</svg>
										</label>
										<label
											className={`cursor-pointer ${
												currentScheduleIndex === props.schedule.length - 1 &&
												"hidden"
											}`}
											onClick={goToNextDay}
											htmlFor=""
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M8.25 4.5l7.5 7.5-7.5 7.5"
												/>
											</svg>
										</label>
									</div>
								</div>
								<hr />

								<>
									<div className="px-1 py-4">
										<p className="text-2xl font-medium">
											{props.schedule[currentScheduleIndex].dayOfWeek}
										</p>
									</div>

									<div className="flex flex-col space-y-6">
										<div className="px-1 flex flex-row justify-between">
											<div className="flex flex-col">
												<div className="uppercase text-sm font-normal">
													<p>Start Time</p>
												</div>

												<div className="text-xl font-bold">
													<p>
														{props.schedule[currentScheduleIndex].startTime}
													</p>
												</div>
											</div>
											<div className="absolute left-1/2">
												<hr
													className="bg-sky-700"
													style={{
														height: "50px",
														width: "1px",
													}}
												/>
											</div>
											<div className="flex flex-col">
												<div className="uppercase text-sm font-normal">
													<p>End Time</p>
												</div>
												<div className="text-xl font-bold">
													<p>{props.schedule[currentScheduleIndex].endTime}</p>
												</div>
											</div>
										</div>

										<div className="px-1 flex flex-row justify-between">
											<div className="flex flex-col">
												<div className="uppercase text-sm font-normal">
													<p>Lunch Start</p>
												</div>

												<div className="text-xl font-bold">
													<p>
														{props.schedule[currentScheduleIndex]
															.lunchBreakStart || "N/A"}
													</p>
												</div>
											</div>
											<div className="absolute left-1/2">
												<hr
													className="bg-sky-700"
													style={{
														height: "50px",
														width: "1px",
													}}
												/>
											</div>
											<div className="flex flex-col">
												<div className="uppercase text-sm font-normal">
													<p>Lunch End</p>
												</div>
												<div className="text-xl font-bold">
													<p>
														{props.schedule[currentScheduleIndex]
															.lunchBreakEnd || "N/A"}
													</p>
												</div>
											</div>
										</div>
									</div>
								</>

								<div className="flex text-sky-800 pt-5 justify-center">
									<p className="border-b border-sky-600 text-lg font-medium">
										Dr. {props.name}
									</p>
								</div>
							</div>

							<div className="bg-white px-4 pb-4 pt-3 relative z-50 shadow-xl rounded-b-xl flex flex-col items-center space-y-3">
								{onClick && (
									<p className="text-md uppercase font-semibold">
										Opthalmologist
									</p>
								)}

								<div className="text-sky-800 -ml-2 text-center flex flex-row space-x-2 items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
										/>
									</svg>

									<p className="text-sm font-normal">{props.email}</p>
								</div>
								<div className="text-sky-800 -ml-2 text-center flex flex-row space-x-2 items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
										/>
									</svg>

									<p className="text-sm font-normal">{props.contact}</p>
								</div>
							</div>
						</>
					) : (
						isSchedule &&
						!isBreak &&
						props.schedule &&
						props.schedule.length === 0 && (
							<>
								<div className="h-full flex flex-col p-5">
									<div className="flex flex-row justify-between pb-2">
										<div className="text-sky-800">
											<label
												className="cursor-pointer"
												onClick={handleScheduleExit}
												htmlFor=""
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="w-6 h-6"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</label>
										</div>
									</div>
									<hr />
									<div className="px-4">
										<img src="/images/nodata.svg" alt="" />
										<div className="text-lg flex flex-col font-medium text-center justify-center">
											<p>No available schedule to show.</p>
										</div>
									</div>
								</div>
								<div className="bg-white p-4 relative z-50 shadow-xl rounded-b-xl flex flex-col items-center space-y-3">
									<div className="text-sky-800 -ml-2 text-center flex flex-row space-x-2 items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
											/>
										</svg>

										<p className="text-sm font-normal">{props.email}</p>
									</div>
									<div className="text-sky-800 -ml-2 text-center flex flex-row space-x-2 items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
											/>
										</svg>

										<p className="text-sm font-normal">{props.contact}</p>
									</div>
								</div>
							</>
						)
					)}
					{isBreak && !isSchedule && props.breaks && props.breaks.length > 0 ? (
						<>
							<div className="flex flex-col h-full p-5">
								<div className="flex flex-row justify-between pb-2">
									<div className="text-sky-800">
										<label
											className="cursor-pointer"
											onClick={handleBreakExit}
											htmlFor=""
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</label>
									</div>

									<div className="flex flex-row">
										<label
											className={`cursor-pointer ${
												currentBreakIndex === 0 && "hidden"
											}`}
											onClick={goToPreviousBreak}
											htmlFor=""
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15.75 19.5L8.25 12l7.5-7.5"
												/>
											</svg>
										</label>
										<label
											className={`cursor-pointer ${
												currentBreakIndex === props.breaks.length - 1 &&
												"hidden"
											}`}
											onClick={goToNextBreak}
											htmlFor=""
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M8.25 4.5l7.5 7.5-7.5 7.5"
												/>
											</svg>
										</label>
									</div>
								</div>
								<hr />

								<>
									<div className="px-1 py-4">
										<p className="text-2xl font-medium">
											{props.breaks[currentBreakIndex].reason}
										</p>
									</div>

									<div className="flex flex-col space-y-6">
										<div className="px-1 flex flex-col justify-between">
											<div className="flex flex-col">
												<div className="uppercase text-sm font-normal">
													<p>Start Date</p>
												</div>

												<div className="text-xl font-bold">
													<p>
														{new Date(
															props.breaks[currentBreakIndex].startDate
														).toLocaleString("en-US", {
															month: "long",
															day: "numeric",
															year: "numeric",
														})}
													</p>
												</div>
											</div>
											<hr className="my-2 border-sky-600" />

											<div className="flex flex-col">
												<div className="uppercase text-sm font-normal">
													<p>End Date</p>
												</div>
												<div className="text-xl font-bold">
													<p>
														{new Date(
															props.breaks[currentBreakIndex].endDate
														).toLocaleString("en-US", {
															month: "long",
															day: "numeric",
															year: "numeric",
														}) || "N/A"}
													</p>
												</div>
											</div>
										</div>
									</div>
								</>

								<div className="flex text-sky-800 pt-5 justify-center">
									<p className="border-b border-sky-600 text-lg font-medium">
										Dr. {props.name}
									</p>
								</div>
							</div>

							<div className="bg-white px-4 pb-4 pt-3 relative z-50 shadow-xl rounded-b-xl flex flex-col items-center space-y-3">
								{onClick && (
									<p className="text-md uppercase font-semibold">
										Opthalmologist
									</p>
								)}

								<div className="text-sky-800 -ml-2 text-center flex flex-row space-x-2 items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
										/>
									</svg>

									<p className="text-sm font-normal">{props.email}</p>
								</div>
								<div className="text-sky-800 -ml-2 text-center flex flex-row space-x-2 items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
										/>
									</svg>

									<p className="text-sm font-normal">{props.contact}</p>
								</div>
							</div>
						</>
					) : (
						isBreak &&
						!isSchedule &&
						props.breaks &&
						props.breaks.length === 0 && (
							<>
								<div className="h-full flex flex-col p-5">
									<div className="flex flex-row justify-between pb-2">
										<div className="text-sky-800">
											<label
												className="cursor-pointer"
												onClick={handleBreakExit}
												htmlFor=""
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="w-6 h-6"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</label>
										</div>
									</div>
									<hr />
									<div className="px-4">
										<img src="/images/nodata.svg" alt="" />
										<div className="text-lg flex flex-col font-medium text-center justify-center">
											<p>No available breaks to show.</p>
										</div>
									</div>
								</div>
								<div className="bg-white p-4 relative z-50 shadow-xl rounded-b-xl flex flex-col items-center space-y-3">
									<div className="text-sky-800 -ml-2 text-center flex flex-row space-x-2 items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
											/>
										</svg>

										<p className="text-sm font-normal">{props.email}</p>
									</div>
									<div className="text-sky-800 -ml-2 text-center flex flex-row space-x-2 items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
											/>
										</svg>

										<p className="text-sm font-normal">{props.contact}</p>
									</div>
								</div>
							</>
						)
					)}
				</div>
			</div>
		</div>
	);
}

export default DoctorCards;
