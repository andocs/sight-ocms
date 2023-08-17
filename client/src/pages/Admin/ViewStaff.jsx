import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStaffAccounts, reset } from '../../features/staff/staffSlice'

import Spinner from '../../components/spinner.component'

import Table from "../../components/table.component"
import { useNavigate } from 'react-router-dom'

function ViewStaff() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { staff, isLoading, isError, message } = useSelector((state) => state.staff) 

  useEffect(() => {
    if(isError){
        toast.error(message)
    }
    dispatch(getStaffAccounts())
    return () => {
      dispatch(reset())
    }
  }, [isError, message, dispatch])

  if(isLoading){
    return <Spinner/>
  }

  const columns = [
    { header: 'Role', field: 'role' },
    { header: 'Last Name', field: 'lname' },
    { header: 'First Name', field: 'fname' },
    { header: 'Email', field: 'email' }, 
    { header: 'Contact', field: 'contact' },
  ];

  const actions = [
    {
      label: 'View',
      handler: (details) => {
        navigate('/admin/staff-details', {state:{ details }})
      },
    },
    {
      label: 'Update',
      handler: (item) => {
        
      },
    },
    {
      label: 'Delete',
      handler: (item) => {
        // Handle delete action here
      },
    },
  ];

  return (
    <>
    <div className="w-full bg-white border-b">
      <div className="p-8 flex justify-between items-center xl:w-5/6">
          <div>
            <p className='font-medium text-5xl'>View Staff Accounts</p>
          </div>
          <div>
            <button onClick={() => navigate('/admin/add-staff')} className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900">Add Account</button>
          </div>
      </div>
    </div>
    
    <div className="p-8">

      <div className='xl:w-5/6 flex flex-row'>
        <Table data={staff} columns={columns} actions={actions} />
      </div>
      
    </div>
    </>
  )
}

export default ViewStaff