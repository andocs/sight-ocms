import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

function TechnicianDashboard() {
    const navigate = useNavigate()
    const errors = []

    const token = localStorage.getItem('user')
    let pushed = 0

    useEffect(() => {
        if (token) {
            const decodedToken = JSON.parse(token);
            const role = decodedToken.role;
            
            if (role !== "technician") {
                navigate(`/${role}`);
                errors.push("Unauthorized Access!");
                if (errors.length>0 && pushed<1){
                    toast.error("Unauthorized Access!")
                    pushed++
                }
            } 
            console.log(token,decodedToken,role,role !== 'technician');
        } else {
            navigate("/login");
            errors.push("Unauthorized Access!");
            if (errors.length>0 && pushed<1){
                toast.error("Unauthorized Access!")
                pushed++
            }
        }
        console.log(pushed,errors);
    }, []);

    return (
        <p className='text-9xl'>TECHNICIAN DASHBOARD</p>

    )
}

export default TechnicianDashboard