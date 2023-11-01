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
			<div className="flex flex-wrap p-8 xl:w-5/6 space-x-16 ">
				{data.length > 0 &&
					data.map((schedule, scheduleIndex) => (
						<DoctorCards key={scheduleIndex} props={schedule} />
					))}
			</div>
		</>
	);
}

export default ViewAllDoctors;
