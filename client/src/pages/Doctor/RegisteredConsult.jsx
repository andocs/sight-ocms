import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getPatientList, reset } from "../../features/patient/patientSlice";

import Spinner from "../../components/spinner.component";
import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";

function RegisteredConsult() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	let [isOpen, setIsOpen] = useState(false);
	const [patientData, setPatientData] = useState(null);

	function closeModal() {
		setIsOpen(false);
	}

	const { patient, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.patient
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getPatientList());
		return () => {
			dispatch(reset());
		};
	}, [isError, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const columns = [
		{ header: "Last Name", field: "lname" },
		{ header: "First Name", field: "fname" },
		{ header: "Email", field: "email" },
		{ header: "Contact", field: "contact" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setPatientData(details);
				setIsOpen(true);
			},
		},
		{
			label: "Confirm",
			handler: (details) => {
				navigate(`/doctor/add-visit/${details._id}`, { state: { details } });
			},
		},
	];

	return (
		<>
			{isOpen && (
				<ViewModal
					isOpen={isOpen}
					closeModal={closeModal}
					dataFields={patientData}
					columnHeaders={columns}
					modalTitle="Patient Details"
				/>
			)}
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Registered Patients</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={patient} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}
export default RegisteredConsult;
