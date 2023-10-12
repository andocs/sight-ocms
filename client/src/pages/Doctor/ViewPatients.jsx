import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPatientList, reset } from "../../features/patient/patientSlice";

import Table from "../../components/table.component";
import ViewModal from "../../components/viewmodal.component";
import Spinner from "../../components/spinner.component";

function ViewPatients() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	let [isOpen, setIsOpen] = useState(false);
	const [patientData, setPatientData] = useState(null);

	function closeModal() {
		setIsOpen(false);
	}

	const { patient, isLoading } = useSelector((state) => state.patient);

	const columns = [
		{ header: "Last Name", field: "lname" },
		{ header: "First Name", field: "fname" },
		{ header: "Email", field: "email" },
		{ header: "Contact", field: "contact" },
	];

	const actions = [
		{
			label: "Details",
			handler: (details) => {
				setPatientData(details);
				setIsOpen(true);
			},
		},
		{
			label: "View",
			handler: (details) => {
				navigate(`/doctor/view-patient-history/${details._id}`, {
					state: { details },
				});
			},
		},
	];

	useEffect(() => {
		dispatch(getPatientList());
		return () => {
			dispatch(reset());
		};
	}, [dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

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
			<div>
				<div className="w-full bg-white border-b">
					<div className="p-8 flex justify-between items-center xl:w-5/6">
						<div>
							<p className="font-medium text-5xl">Registered Patients</p>
						</div>
						<div>
							<button
								onClick={() => navigate("/doctor/add-patient")}
								className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
							>
								Add Patient
							</button>
						</div>
					</div>
				</div>
				<div className="p-8">
					<div className="xl:w-5/6 flex flex-row">
						<Table data={patient} columns={columns} actions={actions} />
					</div>
				</div>
			</div>
		</>
	);
}

export default ViewPatients;
