import { useState } from "react";
import AdminNav from "./adminnav.component";
import PatientNav from "./patientnav.component";
import DoctorNav from "./doctornav.component";
import TechnicianNav from "./techniciannav.component";
import decode from "jwt-decode";

function Sidenav() {
	const token = localStorage.getItem("user");
	let role = null;
	if (token) {
		const decodedToken = decode(token);
		role = decodedToken.user.role;
	}

	const [isExpanded, setIsExpanded] = useState(true);

	const handleToggleWidth = () => {
		setIsExpanded(!isExpanded);
		console.log(isExpanded);
	};

	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}

	return (
		<>
			<aside
				id="logo-sidebar"
				className={classNames(
					isExpanded ? null : "-translate-x-1/2 ml-24",
					"sticky z-10 w-72 left-0 sidenav transition-transform bg-white border-r border-gray-200"
				)}
				aria-label="Sidebar"
			>
				<hr />
				<div className="flex flex-col justify-between h-full overflow-y-auto overflow-x-hidden">
					<div>
						{role === "admin" && <AdminNav />}
						{role === "patient" && <PatientNav />}
						{role === "doctor" && <DoctorNav />}
						{role === "technician" && <TechnicianNav />}
					</div>

					<div className="border-t">
						<div className="m-3 flex items-center self-end">
							<div className="px-3 mr-5">
								<img
									src="/images/dash-logo.png"
									alt=""
									className="object-contain"
								/>
							</div>

							<div className="mr-3 mt-1.5">
								<button onClick={handleToggleWidth}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-6 h-6"
									>
										<path
											fillRule="evenodd"
											d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}

export default Sidenav;
