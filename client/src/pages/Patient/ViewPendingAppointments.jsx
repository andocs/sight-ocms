import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getPendingAppointments,
	reset,
	clear,
} from "../../features/appointment/appointmentSlice";

import Spinner from "../../components/spinner.component";
import ViewModal from "../../components/viewmodal.component";
import Table from "../../components/table.component";

function ViewPendingAppointments() {
	let [isViewOpen, setViewOpen] = useState(false);
	const [appointmentData, setAppointmentData] = useState("");

	const dispatch = useDispatch();
	const { appointment, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.appointment
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getPendingAppointments());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [isError, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	function closeViewModal() {
		setViewOpen(false);
	}

	const columns = [
		{ header: "Date", field: "appointmentDate" },
		{ header: "Status", field: "status" },
		{ header: "Last Name", field: "doctorLastName" },
		{ header: "First Name", field: "doctorFirstName" },
		{ header: "Start Time", field: `appointmentStart` },
		{ header: "End Time", field: "appointmentEnd" },
		{ header: "Additional Notes", field: "notes" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setAppointmentData(details);
				setViewOpen(true);
			},
		},
	];

	return (
		<>
			{isViewOpen && (
				<ViewModal
					isOpen={isViewOpen}
					closeModal={closeViewModal}
					dataFields={appointmentData}
					columnHeaders={columns}
					modalTitle="View Appointment Details"
				/>
			)}

			<div className="w-full bg-white bappointment-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">View Pending Appointments</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={appointment} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewPendingAppointments;
