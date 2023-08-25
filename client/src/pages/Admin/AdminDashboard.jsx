import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import decode from "jwt-decode";
import Sidenav from "../../components/sidenav.component";
import AdminHome from "./AdminHome";

function AdminDashboard() {
	const location = useLocation();
	const navigate = useNavigate();

	const token = localStorage.getItem("user");

	useEffect(() => {
		if (token) {
			const decodedToken = decode(token);
			const role = decodedToken.user.role;

			if (role !== "admin") {
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

	function isAdminHome() {
		if (location.pathname === "/admin") {
			return <AdminHome />;
		} else {
			return <Outlet />;
		}
	}

	return (
		<>
			<div className="flex flex-row overflow-hidden">
				<Sidenav />
				<div className="bg-slate-50 w-full flex flex-col overflow-auto">
					{isAdminHome()}
				</div>
			</div>
		</>
	);
}

export default AdminDashboard;
