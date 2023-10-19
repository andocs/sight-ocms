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

const doctorsvg = (
	<svg
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={2}
		viewBox="0 0 24 24"
		className="ml-0.5 -mr-0.5 w-9 h-9 text-sky-800"
	>
		<path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" />
		<path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4" />
		<path d="M22 10 A2 2 0 0 1 20 12 A2 2 0 0 1 18 10 A2 2 0 0 1 22 10 z" />
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
		href: "/patient",
		svg: dashboardsvg,
	},
	{
		label: "View Doctors",
		href: "/patient/view-doctors",
		svg: doctorsvg,
	},
	{
		label: "View Eye Records",
		href: "/patient/view-records",
		svg: eyerecordmgtsvg,
	},
	{
		label: "View Orders",
		href: "/patient/view-orders",
		svg: ordermgtsvg,
	},
	{
		label: "View Repairs",
		href: "/patient/view-repairs",
		svg: repairmgtsvg,
	},
	{
		label: "Appointment Management",
		svg: appointmentsvg,
		submenus: [
			{
				label: "View Pending",
				href: "/patient/view-pending",
				svg: submenusvg,
			},
			{
				label: "View Appointments",
				href: "/patient/view-appointments",
				svg: submenusvg,
			},
			{
				label: "Schedule Appointment",
				href: "/patient/add-appointment",
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

function PatientNav() {
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

export default PatientNav;
