import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNavPage } from "../features/auth/authSlice";
import NavMenu from "./navmenu.component";

const dashboardsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-10 h-10 text-sky-800"
	>
		<path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
		<path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
	</svg>
);

const usermanagementsvg = (
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

const inventorymgtsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-10 h-10 text-sky-800"
	>
		<path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
		<path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
		<path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
	</svg>
);

const auditlogsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-10 h-10 text-sky-800"
	>
		<path
			fillRule="evenodd"
			d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
			clipRule="evenodd"
		/>
		<path
			fillRule="evenodd"
			d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
			clipRule="evenodd"
		/>
	</svg>
);

const maintenancemgtsvg = (
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
		<path d="M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" />
		<path
			fillRule="evenodd"
			d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z"
			clipRule="evenodd"
		/>
	</svg>
);

const reportgensvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-9 h-9 text-sky-800"
	>
		<path
			fillRule="evenodd"
			d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
			clipRule="evenodd"
		/>
		<path
			fillRule="evenodd"
			d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
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
		href: "/admin",
		svg: dashboardsvg,
	},
	{
		label: "User Management",
		svg: usermanagementsvg,
		submenus: [
			{
				label: "View Staff",
				href: "/admin/view-staff",
				svg: submenusvg,
			},
			{
				label: "Add Staff",
				href: "/admin/add-staff",
				svg: submenusvg,
			},
		],
	},
	{
		label: "Inventory Management",
		svg: inventorymgtsvg,
		submenus: [
			{
				label: "View Inventory",
				href: "/admin/view-inventory",
				svg: submenusvg,
			},
			{
				label: "Add Items",
				href: "/admin/add-item",
				svg: submenusvg,
			},
		],
	},
	{
		label: "Maintenance Management",
		svg: maintenancemgtsvg,
		submenus: [
			{
				label: "View Pending",
				href: "/admin/view-pending",
				svg: submenusvg,
			},
			{
				label: "View Maintenance Requests",
				href: "/admin/view-requests",
				svg: submenusvg,
			},
		],
	},
	{
		label: "Report Generation",
		href: "/admin/report-generation",
		svg: reportgensvg,
	},
	{
		label: "Audit Logs",
		href: "/admin/view-logs",
		svg: auditlogsvg,
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

function AdminNav() {
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

export default AdminNav;
