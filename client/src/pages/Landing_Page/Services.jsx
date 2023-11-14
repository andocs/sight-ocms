import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDoctors, reset } from "../../features/schedule/scheduleSlice";

import CardCarousel from "../../components/cardcarousel.component";
import Spinner from "../../components/spinner.component";

function Services() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [showCarousel, setShowCarousel] = useState(false);
	const { schedule, isLoading } = useSelector((state) => state.schedule);

	const handleShowCarousel = () => {
		setShowCarousel(true);
	};
	const handleShowServices = () => {
		setShowCarousel(false);
	};

	const handleAboutClick = () => {
		navigate("/about");
	};

	useEffect(() => {
		dispatch(getDoctors());
		return () => {
			dispatch(reset());
		};
	}, [dispatch]);

	if ((showCarousel && isLoading) || (showCarousel && !schedule)) {
		return <Spinner />;
	}

	return (
		schedule && (
			<>
				<div className="xl:px-56 xl:py-16 xl:overflow-hidden overflow-auto py-12 flex xl:flex-row xl:space-x-20 flex-col xl:space-y-0 space-y-16 xl:items-start items-center  w-full">
					<div className="xl:relative flex flex-col space-y-14 w-full xl:items-end items-center ">
						<div className="flex flex-col space-y-8 w-full justify-center z-50">
							<div className="flex justify-center w-full">
								<p className="md:text-6xl text-2xl font-medium">
									{showCarousel ? "Our Doctors" : "What We Do"}
								</p>
							</div>
							<div className="flex justify-center w-full">
								<p className="md:text-2xl text-lg">Features & Services</p>
							</div>
							{showCarousel && (
								<div className="flex justify-center w-full">
									<button
										onClick={handleShowServices}
										className="rounded-full w-[200px] bg-sky-800 text-white py-2 hover:bg-sky-600"
									>
										View Services
									</button>
								</div>
							)}
						</div>
						{showCarousel ? (
							<>
								<div className="flex justify-center w-full h-full items-center">
									<div className="w-[500px] h-[550px] -mt-32">
										<CardCarousel cards={schedule} />
									</div>
								</div>
							</>
						) : (
							<>
								<div className="flex flex-row w-full h-full space-x-28 justify-center">
									<div className="bg-white rounded-md border-gray-200 border shadow-lg flex flex-col items-center justify-center w-[300px] h-[450px] px-8 py-4">
										<div className="w-full flex justify-center rounded-t-md px-4">
											<img
												src="/images/card-1.jpg"
												alt=""
												className="object-contain h-52"
											/>
										</div>
										<div className="flex flex-col justify-center items-center space-y-4 pb-8">
											<p className="text-xl font-semibold">Eye Care</p>
											<p className="text-gray-500 text-center">
												Provides eye exams, prescribes lenses, manages diseases,
												and offers guidance for eye health.
											</p>
											<button
												onClick={handleAboutClick}
												className="rounded-full w-2/3 bg-sky-800 text-white py-2 hover:bg-sky-600"
											>
												More
											</button>
										</div>
									</div>
									<div className="bg-white rounded-md border-gray-200 border shadow-lg flex flex-col items-center justify-center w-[300px] h-[450px] px-8 py-4">
										<div className="w-full flex justify-center rounded-t-md px-4">
											<img
												src="/images/card-2.jpg"
												alt=""
												className="object-contain h-52"
											/>
										</div>
										<div className="flex flex-col justify-center items-center space-y-4 pb-8">
											<p className="text-xl font-semibold">Doctors</p>
											<p className="text-gray-500 text-center">
												Maderal optical doctors aid clients with eye grade,
												exams, eye prescriptions, and guidance.
											</p>
											<button
												onClick={handleShowCarousel}
												className="rounded-full w-2/3 bg-sky-800 text-white py-2 hover:bg-sky-600"
											>
												View Doctors
											</button>
										</div>
									</div>
									<div className="bg-white rounded-md border-gray-200 border shadow-lg flex flex-col items-center justify-center w-[300px] h-[450px] px-8 py-4">
										<div className="w-full flex justify-center rounded-t-md px-4">
											<img
												src="/images/card-3.jpg"
												alt=""
												className="object-contain h-52"
											/>
										</div>
										<div className="flex flex-col justify-center items-center space-y-4 pb-8">
											<p className="text-xl font-semibold">Technician</p>
											<p className="text-gray-500 text-center">
												Optical technicians assist clients with eyeglasses
												through fittings, adjustments, and lens advice.
											</p>
											<button
												onClick={handleAboutClick}
												className="rounded-full w-2/3 bg-sky-800 text-white py-2 hover:bg-sky-600"
											>
												More
											</button>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</>
		)
	);
}

export default Services;
