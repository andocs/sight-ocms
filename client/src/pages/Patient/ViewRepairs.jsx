import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getRepairList, reset, clear } from "../../features/repair/repairSlice";

import Spinner from "../../components/spinner.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewRepairs() {
	const [isViewOpen, setViewOpen] = useState(false);
	const [requestData, setRequestData] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { repair, isLoading } = useSelector((state) => state.repair);

	useEffect(() => {
		dispatch(getRepairList());
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
		{ header: "Created Time", field: "createdAt" },
		{ header: "Status", field: "status" },
		{ header: "Technician LName", field: "userLastName" },
		{ header: "Technician FName", field: "userFirstName" },
		{ header: "Item Type", field: `itemType` },
		{ header: "Amount", field: "amount" },
	];

	const viewColumns = [
		{ header: "Created Time", field: "createdAt" },
		{ header: "Accept Time", field: "acceptTime" },
		{ header: "Completed Time", field: "completeTime" },
		{ header: "Status", field: "status" },
		{ header: "Technician LName", field: "userLastName" },
		{ header: "Technician FName", field: "userFirstName" },
		{ header: "Doctor LName", field: "docLastName" },
		{ header: "Doctor FName", field: "docFirstName" },
		{ header: "Item Type", field: `itemType` },
		{ header: "Amount", field: "amount" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setRequestData(details);
				setViewOpen(true);
			},
		},
		{
			label: "Update",
			handler: (details) => {
				navigate(`/doctor/edit-repair/${details._id}`, {
					state: { details },
				});
			},
		},
	];

	return (
		<>
			{isViewOpen && (
				<ViewModal
					isOpen={isViewOpen}
					closeModal={closeViewModal}
					dataFields={requestData}
					columnHeaders={viewColumns}
					modalTitle="View Request Details"
				/>
			)}

			<div className="w-full bg-white bappointment-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Repair List</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					{repair && (
						<Table data={repair} columns={columns} actions={actions} />
					)}
				</div>
			</div>
		</>
	);
}

export default ViewRepairs;
