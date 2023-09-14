import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ViewDetails from "../../components/viewdetails.component";

const imgplaceholder = (
	<div className="flex justify-center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="w-40 self-center"
		>
			<path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
		</svg>
	</div>
);

function TechItemDetails() {
	const location = useLocation();
	const navigate = useNavigate();
	const errors = [];
	let pushed = 0;
	const item = location.state;

	useEffect(() => {
		if (!item) {
			errors.push("No item selected to view.");
			if (errors.length > 0 && pushed < 1) {
				toast.error("No item selected to view.");
				pushed++;
			}
			navigate("/technician");
		}
	}, []);

	const header = { title: "Item Details", buttontext: "Back to View Items" };

	const fields = {
		title: "Item",
		header: item.itemName,
		image: item.image,
		imagelbl: "Item Picture",
		placeholder: imgplaceholder,
		fields: [
			{
				label: "Item Information",
				details: [
					{ label: "Item Name", value: item.itemName },
					{ label: "Description", value: item.description },
					{ label: "Price", value: item.price },
					{ label: "Quantity", value: item.quantity },
					{ label: "Category", value: "placeholder" },
					{ label: "Expiration Date", value: "placeholder" },
					{ label: "Critical Level", value: "placeholder" },
				],
			},
		],
	};

	const goBack = () => {
		navigate("/technician");
	};

	return (
		<>
			<ViewDetails header={header} props={fields} onClick={goBack} />
		</>
	);
}

export default TechItemDetails;
