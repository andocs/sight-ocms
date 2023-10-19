import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
	getPendingRepairs,
	reset,
	clear,
} from "../../features/repair/repairSlice";

import Spinner from "../../components/spinner.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewPendingRepair() {
	const [isViewOpen, setViewOpen] = useState(false);
	const [requestData, setRequestData] = useState("");

	const dispatch = useDispatch();
	const { repair, isLoading } = useSelector((state) => state.repair);

	useEffect(() => {
		dispatch(getPendingRepairs());
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
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
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
	];

	return (
		<>
			{isViewOpen && (
				<ViewModal
					isOpen={isViewOpen}
					closeModal={closeViewModal}
					dataFields={requestData}
					columnHeaders={columns}
					modalTitle="View Request Details"
				/>
			)}

			<div className="w-full bg-white bappointment-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">View Pending Repairs</p>
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

export default ViewPendingRepair;
