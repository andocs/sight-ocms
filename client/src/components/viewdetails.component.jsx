import { useState, useRef, useEffect } from "react";
function ViewDetails({ header, props, onClick, batches }) {
	const [divHeight, setDivHeight] = useState(0);
	const detailsRef = useRef(null);

	const [marginHeight, setMarginHeight] = useState(0);
	const marginRef = useRef(null);

	const [marginWidth, setMarginWidth] = useState(240);

	const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
	const [isImageOverflowing, setIsImageOverflowing] = useState(false);

	const goToNextBatch = () => {
		if (currentBatchIndex < batches.length - 1) {
			setCurrentBatchIndex(currentBatchIndex + 1);
		}
	};

	const goToPreviousBatch = () => {
		if (currentBatchIndex > 0) {
			setCurrentBatchIndex(currentBatchIndex - 1);
		}
	};

	useEffect(() => {
		if (detailsRef.current) {
			const height = detailsRef.current.offsetHeight; // includes padding and border
			setDivHeight(height);
		}
		if (marginRef.current) {
			const height = marginRef.current.clientHeight + 20; // includes padding and border
			setMarginHeight(height);
		}
		const imagediv = document.getElementById("imagediv");
		const wrapper = document.getElementById("wrapper");
		const wrapperComputedStyle = window.getComputedStyle(wrapper, null);
		let wrapperHeight = wrapper.clientHeight;
		wrapperHeight -=
			parseFloat(wrapperComputedStyle.paddingTop) +
			parseFloat(wrapperComputedStyle.paddingBottom);
		const par = document.getElementById("paragraph");
		if (imagediv && wrapperHeight && par) {
			const imagedivHeight = imagediv.offsetHeight + par.offsetHeight + 1;
			console.log(wrapperHeight, imagedivHeight);
			setIsImageOverflowing(imagedivHeight > wrapperHeight);
		}
	}, [detailsRef, marginRef, divHeight, marginHeight]);

	const handleClick = (e) => {
		e.preventDefault();
		onClick();
	};

	const formatDateandTime = (dateString) => {
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		};
		return new Date(dateString).toLocaleString(undefined, options);
	};

	const formatDate = (date) => {
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const expirationDate = new Date(date);
		const formattedDate = expirationDate.toLocaleDateString("en-PH", options);
		return formattedDate;
	};
	return (
		<>
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p id="paragraph" className="font-medium text-5xl">
							{header.title}
						</p>
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

			<div className="p-8 xl:w-5/6">
				{props && (
					<div className="flex flex-row space-x-12 justify-center">
						<div
							key={divHeight}
							style={{ height: `${divHeight}px` }}
							className="bg-white flex flex-col space-y-2 shadow-md items-center pb-4 rounded-xl w-80 overflow-x-hidden "
						>
							<div
								id="wrapper"
								className="bg-white p-8 flex flex-col overflow-hidden"
							>
								<p className="text-3xl font-medium truncate pb-4 text-center">
									{props.imagelbl}
								</p>
								<hr />
								{/* preview */}
								<div
									id="imagediv"
									className={`${
										isImageOverflowing
											? "overflow-y-scroll"
											: "overflow-y-hidden"
									} overflow-x-hidden`}
								>
									{props.image ? (
										<div className="-mx-2 overflow-y-auto overflow-x-hidden">
											<div className="flex justify-center mt-5">
												<div className="px-4 relative flex justify-center">
													<div
														ref={marginRef}
														className="absolute rounded-full overflow-hidden imagepreview"
													>
														<div className="w-full h-full">
															<img
																src={`/images/uploads/${props.image}`}
																className="w-full object-cover"
																alt=""
															/>
														</div>
													</div>
													<div
														style={{
															paddingTop: `${marginHeight}px`,
															width: `${marginWidth}px`,
														}}
													></div>
												</div>
											</div>
										</div>
									) : (
										<div className="flex justify-center mt-3 mb-auto">
											<div className="px-4 relative flex justify-center">
												<div ref={marginRef} className="absolute svgpreview">
													{props.placeholder}
												</div>
												<div
													style={{
														paddingTop: `${marginHeight}px`,
														width: `${marginWidth}px`,
													}}
												></div>
											</div>
										</div>
									)}
									<p className="uppercase text-gray-400 font-semibold text-center">
										{props.title}
									</p>
									<div className="w-full flex flex-row justify-center">
										<p className="font-medium text-4xl text-sky-800 word-break text-center px-4">
											{props.header}
										</p>
									</div>

									{props.subheader && (
										<div className="flex flex-row mb-3 items-center justify-center ">
											{props.subheader}
										</div>
									)}
								</div>
							</div>
						</div>

						<div ref={detailsRef} className={`${batches && "space-y-4"}`}>
							<div
								className={`flex flex-col justify-between w-full
								} ${props.fields.length !== 1 ? "space-y-12" : ""}`}
							>
								{props.fields.map((field, fieldIndex) => (
									<div
										key={fieldIndex}
										className={`bg-white flex flex-col space-y-4 shadow-md rounded-xl ${
											props.fields.length === 1 && "min-h-[250px]"
										} `}
									>
										<div className="p-4">
											<div className="flex flex-row mb-3 items-center">
												<p className="font-medium text-2xl text-sky-800">
													{field.label}
												</p>
											</div>

											<hr />

											<div className="flex flex-col space-y-2 mt-4 mx-2">
												{field.details.map((detail, detailIndex) => (
													<div className="flex flex-row" key={detailIndex}>
														<p className="text-gray-400 font-light">
															{detail.label}
															{": "}
														</p>
														<p
															className={`mx-1 font-medium ${
																detail.label === "Quantity" &&
																detail.value <= field.details[7].value
																	? "text-red-500"
																	: detail.label === "Quantity" &&
																	  detail.value <= field.details[6].value &&
																	  "text-yellow-500"
															}`}
														>
															{console.log(field.details)}
															{detail.label === "Created At"
																? formatDateandTime(detail.value)
																: detail.value}{" "}
														</p>
													</div>
												))}
											</div>
										</div>
									</div>
								))}
							</div>

							{/* Conditionally render batch information */}
							{batches && batches.length > 0 && (
								<div className="bg-white flex flex-col space-y-4 shadow-md rounded-xl">
									<div className="p-4">
										<div className="flex flex-row justify-between items-center mb-3">
											<div className="flex flex-row items-center">
												<p className="font-medium text-2xl text-sky-800">
													Batch Information
												</p>
											</div>
											<div className="space-x-1">
												<button
													className={`${currentBatchIndex === 0 && "hidden"}`}
													onClick={goToPreviousBatch}
													disabled={currentBatchIndex === 0}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														className="w-4 h-4"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M15.75 19.5L8.25 12l7.5-7.5"
														/>
													</svg>
												</button>
												<button
													className={`${
														currentBatchIndex === batches.length - 1 && "hidden"
													}`}
													onClick={goToNextBatch}
													disabled={currentBatchIndex === batches.length - 1}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														className="w-4 h-4"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M8.25 4.5l7.5 7.5-7.5 7.5"
														/>
													</svg>
												</button>
											</div>
										</div>

										<hr />

										<div className="flex flex-col space-y-2 mt-4 mx-2">
											{batches && (
												<div className="space-y-4" key={currentBatchIndex}>
													<div className="flex flex-row ">
														<p className="text-gray-400 font-light">
															Batch Number:
														</p>
														<p className="mx-1 font-medium">
															{batches[currentBatchIndex].batchNumber}
														</p>
													</div>
													<div className="flex flex-row">
														<p className="text-gray-400 font-light">
															Expiration Date:
														</p>
														<p className="mx-1 font-medium">
															{formatDate(
																batches[currentBatchIndex].expirationDate
															)}
														</p>
													</div>
													<div className="flex flex-row">
														<p className="text-gray-400 font-light">
															Batch Quantity:
														</p>
														<p className="mx-1 font-medium">
															{batches[currentBatchIndex].batchQuantity}
														</p>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default ViewDetails;
