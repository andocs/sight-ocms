import { Fragment, useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useLocation } from "react-router-dom";

function SubMenu({ submenus }) {
	const [isMenuOpen, setMenuOpen] = useState(false);
	const location = useLocation();
	const isRouteActive = submenus.submenus.some((submenu) =>
		location.pathname.startsWith(submenu.href)
	);

	useEffect(() => {
		if (isRouteActive) {
			setMenuOpen(true);
		} else {
			setMenuOpen(false);
		}
	}, [isRouteActive]);

	return (
		<>
			<Menu.Button
				onClick={() => setMenuOpen(!isMenuOpen)}
				className="flex w-full justify-between items-center my-3 p-2 text-gray-900 rounded-lg hover:bg-gray-100"
			>
				<div className="text-start flex ml-8 items-center font-medium">
					{submenus.svg}
					<span className="w-[109px] truncate ml-3">{submenus.label}</span>
				</div>
				<ChevronUpIcon
					className={`mr-4 h-5 w-5 text-sky-800 ${
						isMenuOpen ? "rotate-180 transform" : ""
					} `}
				/>
			</Menu.Button>
			{isMenuOpen && (
				<Menu.Items static>
					{submenus.submenus.map((submenu) => (
						<Menu.Item key={submenu.label}>
							<a
								href={submenu.href}
								className={`flex items-center p-2 ${
									location.pathname.startsWith(submenu.href)
										? "text-white bg-sky-800 hover:bg-sky-700"
										: "text-gray-900 hover:bg-gray-100"
								}`}
							>
								<div className="flex ml-8 items-center font-medium">
									{submenu.svg}
									<span className="w-[109px] truncate ml-3">
										{submenu.label}
									</span>
								</div>
							</a>
						</Menu.Item>
					))}
				</Menu.Items>
			)}
		</>
	);
}

function MenuButton({ menus }) {
	const location = useLocation();
	return (
		<Menu.Item
			as="a"
			href={menus.href}
			className={`flex w-full justify-between items-center my-3 p-2 ${
				location.pathname === `${menus.href}`
					? "text-white bg-sky-800 hover:bg-sky-700"
					: "text-gray-900 hover:bg-gray-100"
			}`}
		>
			<div className="text-start flex ml-8 items-center font-medium">
				<div
					className={`${
						location.pathname === `${menus.href}` ? "menu-active" : ""
					}`}
				>
					{menus.svg}
				</div>
				<span className="w-[136px] truncate ml-3">{menus.label}</span>
			</div>
		</Menu.Item>
	);
}

function NavMenu({ mainMenu }) {
	return (
		<Menu>
			{mainMenu.map((menuItem) => (
				<Fragment key={menuItem.label}>
					{menuItem.label === "Dashboard" ? (
						<Menu.Item
							as="a"
							href={menuItem.href}
							className="flex w-full justify-between items-center my-3 p-2 text-gray-900 rounded-lg hover:bg-gray-100"
						>
							<div className="text-start flex ml-8 items-center font-medium">
								{menuItem.svg}
								<span className="ml-3">{menuItem.label}</span>
							</div>
						</Menu.Item>
					) : (
						<>
							{menuItem.submenus ? (
								<SubMenu submenus={menuItem} />
							) : (
								<MenuButton menus={menuItem} />
							)}
						</>
					)}
				</Fragment>
			))}
		</Menu>
	);
}

export default NavMenu;
