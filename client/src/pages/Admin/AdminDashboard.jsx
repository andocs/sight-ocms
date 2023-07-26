import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { toast } from 'react-toastify';

import Sidenav from "../../components/sidenav.component";
import AdminHome from "./AdminHome";

function AdminDashboard() {
    const location = useLocation()
    const navigate = useNavigate()
    const errors = []

    const token = localStorage.getItem('user')
    let pushed = 0

    useEffect(() => {
        if (token) {
            const decodedToken = JSON.parse(token);
            const role = decodedToken.role;
            
            if (role !== "admin") {
                navigate(`/${role}`);
                errors.push("Unauthorized Access!");
                if (errors.length>0 && pushed<1){
                    toast.error("Unauthorized Access!")
                    pushed++
                }
            } 
        } else {
            navigate("/login");
            errors.push("Unauthorized Access!");
            if (errors.length>0 && pushed<1){
                toast.error("Unauthorized Access!")
                pushed++
            }
        }
    }, []);

    function isAdminHome() {
        if (location.pathname === '/admin') {
          return <AdminHome/>
        }else{
          return <Outlet/>
        }
    }
      
    return (   
      <>      
         <div className="flex flex-row overflow-hidden">
            <Sidenav/>
            <div className="w-full flex flex-col overflow-auto">
                {isAdminHome()}
            </div>
         </div>
      </>
    )
}

export default AdminDashboard