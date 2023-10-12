import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
	getConfirmedAppointments,
	reset,
	clear,
} from "../../features/appointment/appointmentSlice";

import Spinner from "../../components/spinner.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewConfirmedStaff() {
	const [isViewOpen, setViewOpen] = useState(false);
	const [appointmentData, setAppointmentData] = useState("");
	const dispatch = useDispatch();
	const { confirmed, isLoading } = useSelector((state) => state.appointment);

	useEffect(() => {
		dispatch(getConfirmedAppointments());

		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	function closeViewModal() {
		setViewOpen(false);
		setAppointmentData("");
	}

	const columns = [
		{ header: "Date", field: "appointmentDate" },
		{ header: "Status", field: "status" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
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
						<p className="font-medium text-5xl">View Confirmed Appointments</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					{confirmed && (
						<Table data={confirmed} columns={columns} actions={actions} />
					)}
				</div>
			</div>
		</>
	);
}

export default ViewConfirmedStaff;
