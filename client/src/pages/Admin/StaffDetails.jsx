import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

function StaffDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const errors = []
    let pushed = 0
    const staff = location.state

    useEffect(() => {
        if (!staff) {
            errors.push("No account selected to view.");
            if (errors.length>0 && pushed<1){
                toast.error("No account selected to view.")
                pushed++
            }
            navigate('/admin')
        }
    }, []);

    console.log(staff.details);

    return (
        <>
        <div className="w-full bg-white border-b">
            <div className="p-8 flex justify-between items-center xl:w-5/6">
                <div>
                    <p className='font-medium text-5xl'>Staff Details</p>
                </div>
                <div>
                    <button type='submit' className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900">Edit Details</button>
                </div>
            </div>
        </div>

        <div className="p-8 xl:w-5/6">
            {staff ? (
                <div className="flex flex-row space-x-36">
                    <div>
                        <div className="bg-sky-800 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-80 h-80">
                                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-row mb-3 items-center">
                            <p className='font-medium text-4xl text-gray-900'>{ staff.details.fname } { staff.details.lname }</p>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className="w-6 h-6 ml-4">
                                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            <p className="text-gray-400">{ staff.details.address }, { staff.details.province }</p>
                        </div>

                        <p className="capitalize text-sky-800 font-semibold">{staff.details.role}</p>
                        {/* <p>Email: {staff.details.email}</p>
                        <p>Contact: {staff.details.contact}</p> */}
                    </div>  
                </div>
            ) : (null)
            }        
        </div>  
        </>
  )
}

export default StaffDetails