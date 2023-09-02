import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import decode from "jwt-decode";

import Sidenav from "../../components/sidenav.component";
import DoctorHome from "./DoctorHome";

function DoctorDashboard() {
	const location = useLocation();
	const navigate = useNavigate();
	const errors = [];
	let pushed = 0;

	const token = localStorage.getItem("user");

	useEffect(() => {
		if (token) {
			const decodedToken = decode(token);
			const role = decodedToken.user.role;

			if (role !== "doctor") {
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

	function isDoctorHome() {
		if (location.pathname === "/doctor") {
			return <DoctorHome />;
		} else {
			return <Outlet />;
		}
	}

	return (
		<>
			<div className="flex flex-row overflow-hidden">
				<Sidenav />
				<div className="bg-slate-50 w-full flex flex-col overflow-auto">
					{isDoctorHome()}
				</div>
			</div>
		</>
	);
}

export default DoctorDashboard;
