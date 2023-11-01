import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getEyeRecords, reset, clear } from "../../features/record/recordSlice";

import Spinner from "../../components/spinner.component";
import ViewModal from "../../components/viewmodal.component";

import Table from "../../components/table.component";

function ViewRecords() {
	let [isViewOpen, setViewOpen] = useState(false);
	const [recordData, setRecordData] = useState("");

	const dispatch = useDispatch();
	const { record, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.record
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getEyeRecords());
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
		{ header: "Record Date", field: "createdAt" },
		{ header: "Last Name", field: "doctorLastName" },
		{ header: "First Name", field: "doctorFirstName" },
		{ header: "OD SPH", field: `rightEye.sphere` },
		{ header: "OD CYL", field: "rightEye.cylinder" },
		{ header: "OD Axis", field: "rightEye.axis" },
		{ header: "OS SPH", field: "leftEye.sphere" },
		{ header: "OS CYL", field: "leftEye.cylinder" },
		{ header: "OS Axis", field: "leftEye.axis" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setRecordData(details);
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
					dataFields={recordData}
					columnHeaders={columns}
					modalTitle="Visit Record Details"
				/>
			)}
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">View Eye Records</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={record} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewRecords;
