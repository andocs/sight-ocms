import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
	getRequestDetails,
	editRequest,
	reset,
} from "../../features/maintenance/maintenanceSlice";

const placeholdersvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-full"
	>
		<path
			fillRule="evenodd"
			d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
			clipRule="evenodd"
		/>
	</svg>
);

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

function EditRequest() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const maintenanceDetails = location.state;
	const requestId = maintenanceDetails.details._id;

	const {
		maintenanceUpdate,
		newMaintenance,
		isLoading,
		isError,
		isSuccess,
		message,
	} = useSelector((state) => state.maintenance);

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
						value: maintenanceUpdate?.title || "",
						name: "title",
						size: "w-full",
					},
				],
				[
					{
						label: "Details *",
						type: "textarea",
						value: maintenanceUpdate?.details || "",
						name: "details",
						size: "w-full",
					},
				],
			],
		},
	];

	const imageGroup = [
		{
			label: "Request Image",
			fields: [
				{
					label: "Image",
					type: "image",
					value: maintenanceUpdate?.image || "",
					name: "image",
					size: "w-full",
				},
			],
			placeholder: placeholdersvg,
		},
	];

	useEffect(() => {
		if (!maintenanceUpdate) {
			dispatch(getRequestDetails(maintenanceDetails.details._id));
		}
	}, [dispatch, maintenanceUpdate, maintenanceDetails]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!maintenanceDetails) {
			toast.error("No maintenance selected to view.");
			navigate("/technician");
		}

		if (isSuccess && newMaintenance !== null) {
			toast.success(message);
			navigate("/technician/view-requests");
		}
		dispatch(reset());
	}, [newMaintenance, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const onSubmit = (formData) => {
		const updateInfo = {};

		const initialData = {
			title: maintenanceUpdate.title,
			details: maintenanceUpdate.details,
			status: maintenanceUpdate.status,
			image: maintenanceUpdate.image !== null ? maintenanceUpdate.image : "",
		};
		for (const key in formData) {
			if (JSON.stringify(initialData[key]) !== JSON.stringify(formData[key])) {
				if (formData[key] !== "") {
					if (formData[key] === undefined) {
						updateInfo[key] = [];
					} else {
						updateInfo[key] = formData[key];
					}
				}
			}
		}
		console.log(updateInfo);
		if (JSON.stringify(updateInfo) === "{}") {
			navigate("/technician/view-requests");
			dispatch(reset());
			dispatch(clear());
		} else {
			if (updateInfo.image) {
				const requestData = new FormData();

				for (const key in updateInfo) {
					console.log(key, updateInfo[key]);
					requestData.append(key, updateInfo[key]);
				}

				dispatch(editRequest({ requestId, requestData }));
			} else {
				const requestData = updateInfo;
				dispatch(editRequest({ requestId, requestData }));
			}
		}
	};

	return (
		<>
			<ReusableForm
				key={maintenanceUpdate ? maintenanceUpdate._id : "default"}
				header={{
					title: "Edit Maintenance Request",
					buttontext: "Update Request",
				}}
				fields={formGroups}
				imageGroup={imageGroup}
				onSubmit={onSubmit}
			/>
		</>
	);
}

export default EditRequest;
