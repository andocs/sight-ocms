import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

import decode from "jwt-decode";
import PatientHome from "./PatientHome";
import Sidenav from "../../components/sidenav.component";

function PatientDashboard() {
	const navigate = useNavigate();
	const errors = [];

	const token = localStorage.getItem("user");
	let pushed = 0;

	useEffect(() => {
		if (token) {
			const decodedToken = decode(token);
			const role = decodedToken.user.role;

			if (role !== "patient") {
				navigate(`/${role}`);
				errors.push("Unauthorized Access!");
				if (errors.length > 0 && pushed < 1) {
					toast.error("Unauthorized Access!");
					pushed++;
				}
			}
		} else {
			navigate("/login");
			errors.push("Unauthorized Access!");
			if (errors.length > 0 && pushed < 1) {
				toast.error("Unauthorized Access!");
				pushed++;
			}
		}
	}, []);

	function isPatientHome() {
		if (location.pathname === "/patient") {
			return <PatientHome />;
		} else {
			return <Outlet />;
		}
	}

	return (
		<>
			<div className="flex flex-row overflow-hidden h-full">
				<Sidenav />
				<div className="bg-slate-50 w-full flex flex-col overflow-auto">
					{isPatientHome()}
				</div>
			</div>
		</>
	);
}

export default PatientDashboard;
