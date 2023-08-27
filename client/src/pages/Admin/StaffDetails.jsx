import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ViewDetails from "../../components/viewdetails.component";

const imgplaceholder = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="#075985"
		className="w-full"
	>
		<path
			fillRule="evenodd"
			d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
			clipRule="evenodd"
		/>
	</svg>
);

const subheadersvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="#075985"
		className="w-6 h-6"
	>
		<path
			fillRule="evenodd"
			d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
			clipRule="evenodd"
		/>
	</svg>
);

function StaffDetails() {
	const location = useLocation();
	const navigate = useNavigate();
	const errors = [];
	let pushed = 0;
	const staff = location.state;

	useEffect(() => {
		if (!staff) {
			errors.push("No account selected to view.");
			if (errors.length > 0 && pushed < 1) {
				toast.error("No account selected to view.");
				pushed++;
			}
			navigate("/admin");
		}
	}, []);

	const header = { title: "Staff Details", buttontext: "Edit Account" };

	const subheader = (
		<div className="flex flex-row mt-3">
			{subheadersvg}
			<p className="text-gray-400 items-center">
				{staff.city}, {staff.province}
			</p>
		</div>
	);
	const fields = {
		title: staff.role,
		header: staff.fname + " " + staff.lname,
		subheadersvg: subheadersvg,
		subheader: subheader,
		image: staff.image,
		imagelbl: "Profile Picture",
		placeholder: imgplaceholder,
		fields: [
			{
				label: "Personal Information",
				details: [
					{ label: "First Name", value: staff.fname },
					{ label: "Last Name", value: staff.lname },
					{
						label: "Role",
						value: staff.role.charAt(0).toUpperCase() + staff.role.slice(1),
					},
					{ label: "Gender", value: staff.gender },
				],
			},
			{
				label: "Contact Information",
				details: [
					{ label: "Email Address", value: staff.email },
					{ label: "Contact Number", value: staff.contact },
					{ label: "Address", value: staff.address },
					{ label: "City", value: staff.city },
					{ label: "Province", value: staff.province },
				],
			},
		],
	};

	const editDetails = (details) => {
		navigate(`/admin/edit-staff/${details._id}`, { state: { details } });
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

export default StaffDetails;
