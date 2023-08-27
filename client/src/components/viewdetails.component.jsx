import { useState, useRef, useEffect } from "react";
function ViewDetails({ header, props, onClick }) {
	const [divHeight, setDivHeight] = useState(0);
	const detailsRef = useRef(null);

	const [marginHeight, setMarginHeight] = useState(0);
	const marginRef = useRef(null);

	const [marginWidth, setMarginWidth] = useState(240);

	useEffect(() => {
		if (detailsRef.current) {
			const height = detailsRef.current.offsetHeight; // includes padding and border
			setDivHeight(height);
		}
		if (marginRef.current) {
			const height = marginRef.current.clientHeight + 20; // includes padding and border
			setMarginHeight(height);
		}
	}, []);

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

			<div className="p-8 xl:w-5/6">
				{props ? (
					<div className="flex flex-row space-x-12 justify-center">
						<div
							style={{ height: `${divHeight}px` }}
							className="bg-white flex flex-col space-y-2 shadow-md items-center pb-4 rounded-xl w-80 overflow-x-hidden "
						>
							<div className="bg-white p-8 flex flex-col overflow-hidden">
								<p className="text-3xl font-medium truncate pb-4 text-center">
									{props.imagelbl}
								</p>
								<hr />
								{/* preview */}
								<div className="overflow-y-scroll overflow-x-hidden">
									{props.image ? (
										<div className="-mx-2 overflow-y-auto overflow-x-hidden">
											<div className="flex justify-center mt-10">
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

						<div
							ref={detailsRef}
							className={`flex flex-col justify-between w-1/3 ${
								props.fields.length !== 1 ? "space-y-12" : ""
							}`}
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
													<p className="mx-1 font-medium"> {detail.value} </p>
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				) : null}
			</div>
		</>
	);
}

export default ViewDetails;
