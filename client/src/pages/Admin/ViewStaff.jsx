import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
	clear,
	deleteStaffAccount,
	getStaffAccounts,
	reset,
} from "../../features/staff/staffSlice";

import Spinner from "../../components/spinner.component";
import DeleteConfirmation from "../../components/deleteconfirmation.component";

import Table from "../../components/table.component";

function ViewStaff() {
	let [isOpen, setIsOpen] = useState(false);
	const [isConfirmed, setConfirmation] = useState(false);
	const [staffId, setStaffId] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { staff, isLoading, isSuccess, isError, message } = useSelector(
		(state) => state.staff
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		if (isSuccess && message !== "") {
			toast.success(message);
		}
		dispatch(getStaffAccounts());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [isError, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	function closeModal() {
		setIsOpen(false);
	}

	function openModal(staffId) {
		setIsOpen(true);
		setStaffId(staffId);
	}

	function checkConfirmation() {
		setConfirmation(true);
		dispatch(deleteStaffAccount(staffId));
		if (isSuccess && message) {
			toast.message(message);
		}
		setIsOpen(false);
	}

	const columns = [
		{ header: "Role", field: "role" },
		{ header: "Last Name", field: "lname" },
		{ header: "First Name", field: "fname" },
		{ header: "Email", field: "email" },
		{ header: "Contact", field: "contact" },
	];

	const actions = [
		{
			label: "View",
			handler: (details) => {
				navigate("/admin/staff-details", { state: { details } });
			},
		},
		{
			label: "Update",
			handler: (details) => {
				navigate(`/admin/edit-staff/${details._id}`, { state: { details } });
			},
		},
		{
			label: "Delete",
			handler: (details) => {
				openModal(details._id);
			},
		},
	];
	return (
		<>
			<DeleteConfirmation
				isOpen={isOpen}
				closeModal={closeModal}
				onConfirm={checkConfirmation}
			/>

			<div className="w-full bg-white border-b">
				<div className="p-8 flex justify-between items-center xl:w-5/6">
					<div>
						<p className="font-medium text-5xl">Staff Accounts</p>
					</div>
					<div>
						<button
							onClick={() => navigate("/admin/add-staff")}
							className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900"
						>
							Add Account
						</button>
					</div>
				</div>
			</div>

			<div className="p-8">
				<div className="xl:w-5/6 flex flex-row">
					<Table data={staff} columns={columns} actions={actions} />
				</div>
			</div>
		</>
	);
}

export default ViewStaff;
