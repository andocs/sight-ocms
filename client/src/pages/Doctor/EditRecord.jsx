import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	getRecordDetails,
	editEyeRecord,
	reset,
} from "../../features/record/recordSlice";

import ReusableForm from "../../components/reusableform.component";
import Spinner from "../../components/spinner.component";

const interval = 0.25;

const ODSPH = [];
const ODSPHMinValue = -6.0;
const ODSPHMaxValue = 6.0;

for (let value = ODSPHMinValue; value <= ODSPHMaxValue; value += interval) {
	if (value > 0) {
		ODSPH.push({ value: `+${value.toFixed(2)}` });
	} else {
		ODSPH.push({ value: value.toFixed(2) });
	}
}

const ODCYL = [];
const ODCYLMinValue = -6.0;
const ODCYLMaxValue = 6.0;

for (let value = ODCYLMinValue; value <= ODCYLMaxValue; value += interval) {
	if (value > 0) {
		ODCYL.push({ value: `+${value.toFixed(2)}` });
	} else {
		ODCYL.push({ value: value.toFixed(2) });
	}
}

const ODAxis = [];
const ODAxisMinValue = 0;
const ODAxisMaxValue = 180;
const axisInterval = 1;

for (
	let value = ODAxisMinValue;
	value <= ODAxisMaxValue;
	value += axisInterval
) {
	ODAxis.push({ value: value.toString() });
}
ODAxis[0].value = "0";

const OSSPH = ODSPH;
const OSCYL = ODCYL;
const OSAxis = ODAxis;

function EditRecord() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const recordDetails = location.state;
	const recordId = recordDetails.details._id;

	const { recordUpdate, newRecord, isLoading, isError, isSuccess, message } =
		useSelector((state) => state.record);

	const formGroups = [
		{
			label: "Right Eye",
			size: "w-1/2",
			fields: [
				[
					{
						label: "Sphere *",
						type: "listbox",
						value: recordUpdate?.rightEye.sphere || "",
						options: ODSPH.map((sphere) => sphere.value),
						name: "rightEye.sphere",
						size: "w-full",
					},
					{
						label: "Cylinder *",
						type: "listbox",
						value: recordUpdate?.rightEye.cylinder || "",
						options: ODCYL.map((cylinder) => cylinder.value),
						name: "rightEye.cylinder",
						size: "w-full",
					},
					{
						label: "Axis *",
						type: "listbox",
						value: recordUpdate?.rightEye.axis.toString() || "",
						options: ODAxis.map((axis) => axis.value),
						name: "rightEye.axis",
						size: "w-full",
					},
				],
			],
		},
		{
			label: "Left Eye",
			size: "w-1/2",
			fields: [
				[
					{
						label: "Sphere *",
						type: "listbox",
						value: recordUpdate?.leftEye.sphere || "",
						options: OSSPH.map((sphere) => sphere.value),
						name: "leftEye.sphere",
						size: "w-full",
					},
					{
						label: "Cylinder *",
						type: "listbox",
						value: recordUpdate?.leftEye.cylinder || "",
						options: OSCYL.map((cylinder) => cylinder.value),
						name: "leftEye.cylinder",
						size: "w-full",
					},
					{
						label: "Axis *",
						type: "listbox",
						value: recordUpdate?.leftEye.axis || "",
						options: OSAxis.map((axis) => axis.value),
						name: "leftEye.axis",
						size: "w-full",
					},
				],
			],
		},
		{
			label: "Others",
			size: "w-full",
			fields: [
				[
					{
						label: "Additional Notes",
						type: "textarea",
						value: recordUpdate?.additionalNotes || "",
						placeholder: "Additional Notes here...",
						name: "additionalNotes",
						size: "w-full",
					},
				],
			],
		},
	];

	useEffect(() => {
		if (!recordUpdate) {
			dispatch(getRecordDetails(recordDetails.details._id));
		}
	}, [dispatch, recordUpdate, recordDetails]);

	useEffect(() => {
		if (isError) {
			if (message && typeof message === "object") {
				message.map((error) => toast.error(error.message));
			} else {
				toast.error(message);
			}
		}

		if (!recordDetails) {
			toast.error("No record selected to view.");
			navigate("/doctor");
		}

		if (isSuccess && newRecord !== null) {
			toast.success(message);
			navigate("/doctor/view-records");
		}
		dispatch(reset());
	}, [newRecord, isError, isSuccess, message, navigate, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	const onSubmit = (formData) => {
		const recordData = formData;
		dispatch(editEyeRecord({ recordId, recordData }));
	};
	return (
		<>
			<ReusableForm
				key={recordUpdate ? recordUpdate._id : "default"}
				header={{
					title: "Edit Eye Record",
					buttontext: "Update Record",
				}}
				fields={formGroups}
				onSubmit={onSubmit}
			/>
		</>
	);
}

export default EditRecord;
