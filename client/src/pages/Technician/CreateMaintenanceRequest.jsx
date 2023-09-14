import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	createRequest,
	reset,
} from "../../features/maintenance/maintenanceSlice";

import ReusableForm from "../../components/reusableform.component";

const header = {
	title: "Add Maintenance Request",
	buttontext: "Create Request",
};

function CreateMaintenanceRequest() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { newMaintenance, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.maintenance);

	const formGroups = [
		{
			label: "Request Information",
			size: "w-full",
			fields: [
				[
					{
						label: "Title *",
						type: "text",
						placeholder: "Title",
						value: "",
						name: "title",
						size: "w-full",
					},
				],
				[
					{
						label: "Details *",
						type: "textarea",
						placeholder: "Details here...",
						value: "",
						name: "details",
						size: "w-full",
					},
				],
				[
					{
						label: "Image",
						type: "image",
						name: "image",
						size: "w-full",
					},
				],
			],
		},
	];

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (isSuccess && newMaintenance !== null && message !== "") {
			navigate("/technician");
			toast.success(message);
		}

		dispatch(reset());
	}, [
		newMaintenance,
		isLoading,
		isError,
		isSuccess,
		message,
		navigate,
		dispatch,
	]);

	const onSubmit = (formData) => {
		if (formData.image !== "") {
			const requestData = new FormData();
			requestData.append("title", formData.title);
			requestData.append("details", formData.details);
			requestData.append("image", formData.image);
			dispatch(createRequest(requestData));
		} else {
			const requestData = formData;
			dispatch(createRequest(requestData));
		}
	};

	return (
		<>
			<ReusableForm header={header} fields={formGroups} onSubmit={onSubmit} />
		</>
	);
}

export default CreateMaintenanceRequest;
