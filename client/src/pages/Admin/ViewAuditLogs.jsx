import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAuditLogs, reset } from "../../features/audit/auditSlice";
import Spinner from "../../components/spinner.component";
import Table from "../../components/table.component";
import LogDetails from "../../components/logdetails.component";
function ViewAuditLogs() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	let [isOpen, setIsOpen] = useState(false);
	const [selectedLogData, setSelectedLogData] = useState(null); // Track selected log data

	function closeModal() {
		setIsOpen(false);
	}

	const { audit, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.audit
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getAuditLogs());
		return () => {
			dispatch(reset());
		};
	}, [isError, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const columns = [
		{ header: "Created At", field: "createdAt" },
		{ header: "Last Name", field: "userLastName" },
		{ header: "First Name", field: "userFirstName" },
		{ header: "Operation", field: "operation" },
		{ header: "IP Address", field: "userIpAddress" },
		{ header: "entity", field: "entity" },
		{ header: "Entity ID", field: "entityId" },
		{ header: "Info", field: "additionalInfo" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				setSelectedLogData(details);
				setIsOpen(true);
			},
		},
	];

	return (
		<>
			{isOpen && (
				<LogDetails
					isOpen={isOpen}
					closeModal={closeModal}
					logData={selectedLogData}
				/>
			)}
			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Audit Logs</p>
					</div>
				</div>
			</div>
			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={audit} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewAuditLogs;
