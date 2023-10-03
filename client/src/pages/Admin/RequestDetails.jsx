import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ViewDetails from "../../components/viewdetails.component";

function RequestDetails() {
	const location = useLocation();
	const navigate = useNavigate();

	const errors = [];
	let pushed = 0;
	const request = location.state;

	useEffect(() => {
		if (!request) {
			errors.push("No request selected to view.");
			if (errors.length > 0 && pushed < 1) {
				toast.error("No request selected to view.");
				pushed++;
			}
			navigate("/admin");
		}
	}, []);

	console.log(request);

	const header = { title: "Request Details", buttontext: "View Request List" };
	const fields = {
		title: request.status,
		header: request.title,
		image: request.image,
		imagelbl: "Request Image",
		fields: [
			{
				label: "Request Details",
				details: [
					{ label: "Created At", value: request.createdAt },
					{ label: "Title", value: request.title },
					{ label: "Details", value: request.details },
					{ label: "Status", value: request.status },
					{ label: "Technician First Name", value: request.userLastName },
					{ label: "Technician Last Name", value: request.userFirstName },
				],
			},
		],
	};
	return (
		<>
			<ViewDetails
				header={header}
				props={fields}
				onClick={() => editDetails(staff)}
			/>
		</>
	);
}

export default RequestDetails;
