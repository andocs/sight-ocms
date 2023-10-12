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
		href: "/staff",
		svg: dashboardsvg,
	},
	{
		label: "View Patients",
		href: "/staff/view-patients",
		svg: patientsvg,
	},
	{
		label: "View Visit Records",
		href: "/staff/view-visits",
		svg: visitrecordsvg,
	},
	{
		label: "Appointment Management",
		svg: appointmentsvg,
		submenus: [
			{
				label: "View Scheduled",
				href: "/staff/view-scheduled",
				svg: submenusvg,
			},
			{
				label: "View Confirmed",
				href: "/staff/view-confirmed",
				svg: submenusvg,
			},
			{
				label: "View Appointments",
				href: "/staff/view-appointments",
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

function StaffNav() {
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

export default StaffNav;
