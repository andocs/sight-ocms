import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
	getScheduledAppointments,
	editAppointment,
	reset,
	clear,
} from "../../features/appointment/appointmentSlice";

import Spinner from "../../components/spinner.component";
import ViewModal from "../../components/viewmodal.component";
import StatusModal from "../../components/statusmodal.component";

import Table from "../../components/table.component";

function ViewScheduledStaff() {
	const [isViewOpen, setViewOpen] = useState(false);
	const [appointmentData, setAppointmentData] = useState("");
	const [isStatusModalOpen, setStatusModalOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const dispatch = useDispatch();
	const { scheduled, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.appointment
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getScheduledAppointments());

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
		setAppointmentData("");
	}

	const columns = [
		{ header: "Date", field: "appointmentDate" },
		{ header: "Status", field: "status" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Contact", field: `userContact` },
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
		{
			label: "Update",
			handler: (details) => {
				setSelectedAppointment(details);
				setStatusModalOpen(true);
			},
		},
	];
	const handleStatus = (updates) => {
		const appointmentId = selectedAppointment._id;
		const appointmentData = { status: updates };
		dispatch(editAppointment({ appointmentId, appointmentData }));
	};

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

			{isStatusModalOpen && (
				<StatusModal
					appointment={selectedAppointment}
					isOpen={isStatusModalOpen}
					closeModal={() => setStatusModalOpen(false)}
					handleStatusChange={handleStatus}
				/>
			)}

			<div className="w-full bg-white bappointment-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">View Scheduled Appointments</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					{scheduled && (
						<Table data={scheduled} columns={columns} actions={actions} />
					)}
				</div>
			</div>
		</>
	);
}

export default ViewScheduledStaff;
