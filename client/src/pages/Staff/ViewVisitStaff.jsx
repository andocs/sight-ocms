import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getVisitList, reset, clear } from "../../features/visit/visitSlice";

import Spinner from "../../components/spinner.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewVisitStaff() {
	const [isViewOpen, setViewOpen] = useState(false);
	const [visitData, setVisitData] = useState("");

	const dispatch = useDispatch();
	const { visit, isLoading } = useSelector((state) => state.visit);

	useEffect(() => {
		dispatch(getVisitList());
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
	}

	const columns = [
		{ header: "Visit Date", field: "visitDate" },
		{ header: "Patient Type", field: "patientType" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Visit Type", field: "visitType" },
		{ header: "Reason", field: "reason" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setVisitData(details);
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
					dataFields={visitData}
					columnHeaders={columns}
					modalTitle="Visit Record Details"
				/>
			)}

			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Visit Records</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={visit} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewVisitStaff;
