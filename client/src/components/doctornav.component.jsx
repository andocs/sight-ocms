import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNavPage } from "../features/auth/authSlice";
import NavMenu from "./navmenu.component";

const dashboardsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
		<path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
	</svg>
);

const patientsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-10 h-10 text-sky-800"
	>
		<path
			fillRule="evenodd"
			d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
			clipRule="evenodd"
		/>
	</svg>
);

const consultationsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path
			fillRule="evenodd"
			d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
			clipRule="evenodd"
		/>
		<path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
	</svg>
);

const visitrecordsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-10 h-10 text-sky-800"
	>
		<path
			fillRule="evenodd"
			d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 011.5 1.5H12z"
			clipRule="evenodd"
		/>
		<path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" />
		<path d="M10.5 10.5a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963 5.23 5.23 0 00-3.434-1.279h-1.875a.375.375 0 01-.375-.375V10.5z" />
	</svg>
);

const registeredsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="text-gray-400 ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900"
	>
		<path
			fillRule="evenodd"
			d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
			clipRule="evenodd"
		/>
	</svg>
);

const addpatientsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
	</svg>
);

const repairmgtsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path
			fillRule="evenodd"
			d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
			clipRule="evenodd"
		/>
	</svg>
);

const appointmentsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path
			fillRule="evenodd"
			d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
			clipRule="evenodd"
		/>
		<path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
	</svg>
);

const eyerecordmgtsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
		<path
			fillRule="evenodd"
			d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
			clipRule="evenodd"
		/>
	</svg>
);

const walkinsvg = (
	<svg
		viewBox="0 0 320 512"
		fill="currentColor"
		className="text-gray-400 ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900"
	>
		<path d="M256 48c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48zM126.5 199.3c-1 .4-1.9.8-2.9 1.2l-8 3.5c-16.4 7.3-29 21.2-34.7 38.2l-2.6 7.8c-5.6 16.8-23.7 25.8-40.5 20.2S12 246.5 17.6 229.7l2.6-7.8c11.4-34.1 36.6-61.9 69.4-76.5l8-3.5c20.8-9.2 43.3-14 66.1-14 44.6 0 84.8 26.8 101.9 67.9l15.4 36.9 21.4 10.7c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L247 287.3c-10.3-5.2-18.4-13.8-22.8-24.5l-9.6-23-19.3 65.5 49.5 54c5.4 5.9 9.2 13 11.2 20.8l23 92.1c4.3 17.1-6.1 34.5-23.3 38.8s-34.5-6.1-38.8-23.3l-22-88.1-70.7-77.1c-14.8-16.1-20.3-38.6-14.7-59.7l16.9-63.5zM68.7 398l25-62.4c2.1 3 4.5 5.8 7 8.6l40.7 44.4-14.5 36.2c-2.4 6-6 11.5-10.6 16.1l-61.7 61.7c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L68.7 398z" />
	</svg>
);

const ordermgtsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
	</svg>
);

const schedmgtsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path
			fillRule="evenodd"
			d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
			clipRule="evenodd"
		/>
	</svg>
);

const breakmgt = (
	<svg
		viewBox="0 0 576 512"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path d="M432 96c26.5 0 48-21.5 48-48S458.5 0 432 0s-48 21.5-48 48 21.5 48 48 48zm-84.3 104.5c1-.4 1.9-.8 2.9-1.2l-16.9 63.5c-5.6 21.1-.1 43.6 14.7 59.7l70.7 77.1 22 88.1c4.3 17.1 21.7 27.6 38.8 23.3s27.6-21.7 23.3-38.8l-23-92.1c-1.9-7.8-5.8-14.9-11.2-20.8l-49.5-54 19.3-65.5 9.6 23c4.4 10.6 12.5 19.3 22.8 24.5l26.7 13.3c15.8 7.9 35 1.5 42.9-14.3s1.5-35-14.3-42.9L505 232.7l-15.3-36.8c-17.2-41.1-57.4-67.9-102-67.9-22.8 0-45.3 4.8-66.1 14l-8 3.5c-32.9 14.6-58.1 42.4-69.4 76.5l-2.6 7.8c-5.6 16.8 3.5 34.9 20.2 40.5s34.9-3.5 40.5-20.2l2.6-7.8c5.7-17.1 18.3-30.9 34.7-38.2l8-3.5zm-30 135.1l-25 62.4-59.4 59.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l61.7-61.7c4.6-4.6 8.2-10.1 10.6-16.1l14.5-36.2-40.7-44.4c-2.5-2.7-4.8-5.6-7-8.6zM256 274.1c-7.7-4.4-17.4-1.8-21.9 5.9l-32 55.4-54.4-31.4c-15.3-8.8-34.9-3.6-43.7 11.7L40 426.6c-8.8 15.3-3.6 34.9 11.7 43.7l55.4 32c15.3 8.8 34.9 3.6 43.7-11.7l64-110.9c1.5-2.6 2.6-5.2 3.3-8l43.8-75.7c4.4-7.7 1.8-17.4-5.9-21.9z" />
	</svg>
);

const submenusvg = (
	<svg
		aria-hidden="true"
		className="text-gray-400 ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900"
		fill="currentColor"
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
		<path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
	</svg>
);

const mainMenu = [
	{
		label: "Dashboard",
		href: "/doctor",
		svg: dashboardsvg,
	},
	{
		label: "View Patients",
		href: "/doctor/view-patients",
		svg: patientsvg,
	},
	{
		label: "Consultation",
		svg: consultationsvg,
		submenus: [
			{
				label: "Walk In Patient",
				href: "/doctor/walk-in",
				svg: walkinsvg,
			},
			{
				label: "Registered Patient",
				href: "/doctor/registered",
				svg: registeredsvg,
			},
		],
	},
	{
		label: "Visit Management",
		svg: visitrecordsvg,
		submenus: [
			{
				label: "View Visit Records",
				href: "/doctor/view-visits",
				svg: submenusvg,
			},
			{
				label: "Add Visit Record",
				href: "/doctor/add-visit",
				svg: submenusvg,
			},
		],
	},
	{
		label: "Eye Records Management",
		svg: eyerecordmgtsvg,
		submenus: [
			{
				label: "View Records",
				href: "/doctor/view-records",
				svg: submenusvg,
			},
			{
				label: "Add Record",
				href: "/doctor/add-record",
				svg: submenusvg,
			},
		],
	},
	{
		label: "Order Management",
		svg: ordermgtsvg,
		submenus: [
			{
				label: "View Orders",
				href: "/doctor/view-orders",
				svg: submenusvg,
			},
			{
				label: "Add Order",
				href: "/doctor/add-order",
				svg: submenusvg,
			},
		],
	},
	{
		label: "Appointment Management",
		svg: appointmentsvg,
		submenus: [
			{
				label: "View Pending",
				href: "/doctor/view-pending",
				svg: submenusvg,
			},
			{
				label: "View Appointments",
				href: "/doctor/view-appointments",
				svg: submenusvg,
			},
			{
				label: "Add Appointment",
				href: "/doctor/add-appointment",
				svg: submenusvg,
			},
		],
	},
	{
		label: "Repair Management",
		svg: repairmgtsvg,
		submenus: [
			{
				label: "View Repair List",
				href: "/doctor/view-repair",
				svg: submenusvg,
			},
			{
				label: "View Pending Repairs",
				href: "/doctor/pending-repairs",
				svg: submenusvg,
			},
			{
				label: "Add Repair Request",
				href: "/doctor/add-repair",
				svg: submenusvg,
			},
		],
	},
	{
		label: "Schedule Management",
		svg: schedmgtsvg,
		submenus: [
			{
				label: "View Schedule",
				href: "/doctor/view-schedule",
				svg: submenusvg,
			},
			{
				label: "Add Schedule",
				href: "/doctor/add-schedule",
				svg: submenusvg,
			},
		],
	},
	{
		label: "Break Management",
		svg: breakmgt,
		submenus: [
			{
				label: "View Breaks",
				href: "/doctor/view-breaks",
				svg: submenusvg,
			},
			{
				label: "Add Break",
				href: "/doctor/add-break",
				svg: submenusvg,
			},
		],
	},
];

function stripMainMenu(mainMenu) {
	const strippedMenu = [];

	mainMenu.forEach((item) => {
		if (item.label !== "Dashboard") {
			if (item.submenus) {
				// If item has submenus, include submenus instead
				strippedMenu.push(
					...item.submenus.map((submenu) => ({
						label: submenu.label,
						href: submenu.href,
					}))
				);
			} else {
				// Otherwise, include the main item
				strippedMenu.push({
					label: item.label,
					href: item.href,
				});
			}
		}
	});

	return strippedMenu;
}

function DoctorNav() {
	const dispatch = useDispatch();

	useEffect(() => {
		const updatedNav = stripMainMenu(mainMenu);
		dispatch(setNavPage(updatedNav));
	}, [dispatch]);
	return (
		<div>
			<NavMenu mainMenu={mainMenu} />
		</div>
	);
}
export default DoctorNav;
