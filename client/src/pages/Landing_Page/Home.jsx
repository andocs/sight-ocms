import { useNavigate } from "react-router-dom";
function Home() {
	const navigate = useNavigate();

	const handleAboutClick = () => {
		navigate("/about");
	};

	return (
		<>
			<div className="xl:px-56 xl:py-24 xl:overflow-hidden overflow-auto py-12 flex xl:flex-row xl:space-x-32 flex-col xl:space-y-0 space-y-16 xl:items-start items-center  w-full">
				<div className="xl:relative flex flex-col space-y-6 w-auto xl:items-start items-center ">
					<div className="flex">
						<div>
							<p className="md:text-3xl text-2xl font-medium">SIGHT</p>
						</div>
					</div>
					<div>
						<p className="xl:w-[500px] md:text-8xl text-4xl font-semibold break-words md:w-[600px] w-[200px] text-center xl:text-start">
							Take care of your eyes
						</p>
					</div>
					<div className="pt-2">
						<button
							onClick={handleAboutClick}
							type="button"
							className="text-sky-800 hover:text-white border-2 border-sky-800 hover:bg-sky-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md md:text-l px-7 py-1.5 text-base text-center mr-1 mb-1 dark:border-sky-800 dark:text-sky-800 dark:hover:text-white dark:hover:bg-sky-800 dark:focus:ring-sky-900"
						>
							LEARN MORE
						</button>
					</div>
				</div>

				<div className="w-full xl:items-start items-center">
					<div>
						<img
							src="/images/home-background.png"
							alt=""
							className="xl:absolute xl:w-auto w-full xl:object-none object-fill"
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
