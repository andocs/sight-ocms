import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function StaffDetails() {
	const location = useLocation();
	const navigate = useNavigate();
	const errors = [];
	let pushed = 0;
	const staff = location.state;

	useEffect(() => {
		if (!staff) {
			errors.push("No account selected to view.");
			if (errors.length > 0 && pushed < 1) {
				toast.error("No account selected to view.");
				pushed++;
			}
			navigate("/admin");
		}
	}, []);

	const editDetails = (details) => {
		console.log("clicked", details);
		navigate(`/admin/edit-staff/${details._id}`, { state: { details } });
	};

	return (
		<>
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Staff Details</p>
					</div>
					<div>
						<button
							type="button"
							onClick={() => editDetails(staff.details)}
							className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
						>
							Edit Details
						</button>
					</div>
				</div>
			</div>

			<div className="p-8 xl:w-5/6">
				{staff ? (
					<div className="flex flex-row space-x-12 justify-center">
						<div className="flex flex-col space-y-2 shadow-md items-center pb-8 rounded-lg w-1/4">
							<div className="rounded-lg mx-4 mt-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="#075985"
									className="w-full"
								>
									<path
										fillRule="evenodd"
										d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
										clipRule="evenodd"
									/>
								</svg>
							</div>

							<p className="uppercase text-gray-400 font-semibold">
								{staff.details.role}
							</p>
							<div className="w-full flex flex-row justify-center">
								<p className="font-medium text-4xl text-sky-800 word-break text-center px-4">
									{staff.details.fname} {staff.details.lname}
								</p>
							</div>

							<div className="flex flex-row mb-3 items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="#075985"
									className="w-6 h-6"
								>
									<path
										fillRule="evenodd"
										d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
										clipRule="evenodd"
									/>
								</svg>
								<p className="text-gray-400">
									{staff.details.city}, {staff.details.province}
								</p>
							</div>
						</div>

						<div className="flex flex-col justify-between space-y-12 w-1/3">
							<div className="flex flex-col space-y-4 shadow-md rounded-lg">
								<div className="p-4">
									<div className="flex flex-row mb-3 items-center">
										<p className="font-medium text-2xl text-sky-800">
											Personal Information
										</p>
									</div>

									<hr />

									<div className="flex flex-col space-y-2 mt-4 mx-2">
										<div className="flex flex-row">
											<p className="text-gray-400 font-light">First Name: </p>
											<p className="mx-1 font-medium">
												{" "}
												{staff.details.fname}{" "}
											</p>
										</div>

										<div className="flex flex-row">
											<p className="text-gray-400 font-light">Last Name: </p>
											<p className="mx-1 font-medium">
												{" "}
												{staff.details.lname}{" "}
											</p>
										</div>

										<div className="flex flex-row">
											<p className="text-gray-400 font-light">Role: </p>
											<p className="mx-1 capitalize font-medium">
												{" "}
												{staff.details.role}{" "}
											</p>
										</div>

										<div className="flex flex-row">
											<p className="text-gray-400 font-light">Gender: </p>
											<p className="mx-1 font-medium">
												{" "}
												{staff.details.gender}{" "}
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-col space-y-4 shadow-md rounded-lg">
								<div className="p-4">
									<div className="flex flex-row mb-3 items-center">
										<p className="font-medium text-2xl text-sky-800">
											Contact Information
										</p>
									</div>

									<hr />

									<div className="flex flex-col space-y-2 mt-4 mx-2">
										<div className="flex flex-row">
											<p className="text-gray-400 font-light">Email: </p>
											<p className="mx-1 font-medium">
												{" "}
												{staff.details.email}{" "}
											</p>
										</div>

										<div className="flex flex-row">
											<p className="text-gray-400 font-light">
												Contact Number:{" "}
											</p>
											<p className="mx-1 capitalize font-medium">
												{" "}
												{staff.details.contact}{" "}
											</p>
										</div>

										<div className="flex flex-row">
											<p className="text-gray-400 font-light">Address: </p>
											<p className="mx-1 font-medium">
												{" "}
												{staff.details.address}{" "}
											</p>
										</div>

										<div className="flex flex-row">
											<p className="text-gray-400 font-light">City: </p>
											<p className="mx-1 font-medium"> {staff.details.city} </p>
										</div>

										<div className="flex flex-row">
											<p className="text-gray-400 font-light">Province: </p>
											<p className="mx-1 font-medium">
												{" "}
												{staff.details.province}{" "}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
}

export default StaffDetails;
