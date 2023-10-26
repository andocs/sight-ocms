import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUser, logout, reset, clear } from "../features/auth/authSlice";
import decode from "jwt-decode";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Services", href: "/services" },
	{ name: "About", href: "/about" },
];

const defaultsvg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="#075985"
		className="w-8 h-8 rounded-full bg-white"
	>
		<path
			fillRule="evenodd"
			d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
			clipRule="evenodd"
		/>
	</svg>
);

export default function Navbar() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const { infoUpdate, navPage } = useSelector((state) => state.auth);

	const user = localStorage.getItem("user");

	const onLogout = () => {
		dispatch(clear());
		dispatch(reset());
		dispatch(logout());
		navigate("/");
		window.location.reload();
	};

	const token = localStorage.getItem("user");
	let role = null;
	let name = null;
	if (token) {
		const decodedToken = decode(token);
		name = decodedToken.user.name;
		role = decodedToken.user.role;
	}

	useEffect(() => {
		if (token && !infoUpdate) {
			dispatch(getUser());
		}
	}, [dispatch, infoUpdate]);

	const updatedNavigation =
		user && navPage
			? [
					...navigation,
					{ name: "Dashboard", href: `/${role}` },
					...navPage.map((item) => ({
						name: item.label,
						href: item.href,
					})),
			  ]
			: [...navigation, { name: "Login", href: "/login" }];

	const isDashboardRoute = [
		"/admin",
		"/patient",
		"/doctor",
		"/technician",
		"/staff",
	].some((route) => location.pathname.startsWith(route));

	return (
		<>
			{!location.pathname.startsWith("/view-pdf/") && (
				<div keyid="navbar" className="z-40 sticky w-full bg-white">
					<Disclosure as="nav">
						{({ open }) => (
							<>
								<div className="overflow-x-hidden overflow-y-auto mx-auto max-w-full sm:px-6 lg:px-8 border-b-2 border-slate-300">
									<div className="flex h-32 items-center justify-between">
										<div className="sm:absolute relative inset-y-0 left-0 flex items-center sm:hidden">
											{/* Mobile menu button*/}
											<Disclosure.Button className="inline-flex z-40 items-center justify-center rounded-md ml-2 p-2 text-sky-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
												<span className="sr-only">Open main menu</span>
												{open ? (
													<XMarkIcon
														className="block h-6 w-6"
														aria-hidden="true"
													/>
												) : (
													<Bars3Icon
														className="block h-6 w-6"
														aria-hidden="true"
													/>
												)}
											</Disclosure.Button>
										</div>
										<div className="left-0 absolute flex w-full items-center justify-center  sm:justify-start">
											<a
												href="/home"
												className="absolute md:relative sm:block z-50 flex-none lg:max-w-xs px-6"
											>
												<img
													className="block h-8 w-auto lg:hidden"
													src="/images/sight-logo.png"
													alt="Your Company"
												/>
												<p className="hidden xl:w-[350px] lg:block font-semibold lg:text-xl lg:w-[250px] xl:text-2xl break-words">
													{" "}
													OPTICAL CLINIC MANAGEMENT SYSTEM
												</p>
											</a>
											<div className="relative mt-1 md:absolute w-full">
												<div className="hidden ml-0 -mt-2 sm:flex grow sm:place-items-center justify-center relative">
													{isDashboardRoute ? (
														<div className="w-2/6">
															<form>
																<label
																	htmlFor="default-search"
																	className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
																>
																	Search
																</label>
																<div className="relative">
																	<input
																		type="search"
																		id="default-search"
																		className="placeholder:text-gray-400 font-medium block w-full pl-8 py-4 pr-4 text-sky-800 border border-sky-800 rounded-full bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
																		placeholder="Search resources..."
																	/>
																	<button
																		type="submit"
																		className="text-white bg-white absolute right-2.5 bottom-2.5 rounded-full focus:ring-4 font-medium text-sm px-4 py-2"
																	>
																		<svg
																			aria-hidden="true"
																			className="w-6 h-6 text-gray-400"
																			fill="none"
																			stroke="currentColor"
																			viewBox="0 0 24 24"
																			xmlns="http://www.w3.org/2000/svg"
																		>
																			<path
																				strokeLinecap="round"
																				strokeLinejoin="round"
																				strokeWidth="4"
																				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
																			></path>
																		</svg>
																	</button>
																</div>
															</form>
														</div>
													) : (
														<div>
															<div className="flex space-x-4">
																{updatedNavigation.map((item) => (
																	<NavLink
																		to={`${item.href}`}
																		key={`${item.name}`}
																		className={`rounded-md px-3 py-2 text-xl font-medium
																	${
																		location.pathname === item.href ||
																		(location.pathname === "/home" &&
																			item.href === "/")
																			? "bg-sky-800 text-white"
																			: "text-sky-800 hover:bg-sky-700 hover:text-white"
																	}
																		`}
																		aria-current={`${
																			location.pathname === item.href
																				? "page"
																				: undefined
																		}`}
																		onClick={
																			item.name === "Logout"
																				? (e) => {
																						e.preventDefault();
																						item.onClick();
																				  }
																				: undefined
																		}
																	>
																		{item.name}
																	</NavLink>
																))}
															</div>
														</div>
													)}
												</div>
											</div>
										</div>
										<div className="absolute right-0 pr-4">
											{!user ? null : (
												<div className="relative inset-y-0 right-0 flex items-center">
													<p>Hey, {name ? name : "John Doe"}!</p>
													{/* <button
														type="button"
														className="rounded-full bg-slate-50 p-1 text-sky-800 hover:text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-800 focus:ring-offset-2"
													>
														<span className="sr-only">View notifications</span>
														<BellIcon className="h-6 w-6" aria-hidden="true" />
													</button> */}

													{/* Profile dropdown */}
													<Menu as="div" className="ml-3">
														<div>
															<Menu.Button className="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-800">
																<span className="sr-only">Open user menu</span>

																{infoUpdate?.image ? (
																	<img
																		className="h-8 w-8 rounded-full"
																		src={`/images/uploads/${infoUpdate?.image}`}
																		alt=""
																	/>
																) : (
																	<>{defaultsvg}</>
																)}
															</Menu.Button>
														</div>
														<Transition
															as={Fragment}
															enter="transition ease-out duration-100"
															enterFrom="transform opacity-0 scale-95"
															enterTo="transform opacity-100 scale-100"
															leave="transition ease-in duration-75"
															leaveFrom="transform opacity-100 scale-100"
															leaveTo="transform opacity-0 scale-95"
														>
															<Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
																<Menu.Item>
																	{({ active }) => (
																		<a
																			href="/profile"
																			className={`block px-4 py-2 text-sm text-gray-700 
																	${active ? "bg-gray-100" : ""}`}
																		>
																			Your Profile
																		</a>
																	)}
																</Menu.Item>
																<Menu.Item>
																	{({ active }) => (
																		<a
																			href="#"
																			className={`block px-4 py-2 text-sm text-gray-700 
																	${active ? "bg-gray-100" : ""}`}
																			onClick={onLogout}
																		>
																			Sign out
																		</a>
																	)}
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</Menu>
												</div>
											)}
										</div>
									</div>
								</div>

								<Disclosure.Panel className="sm:hidden">
									<div className="space-y-1 px-2 pb-3 pt-2">
										{updatedNavigation.map((item) => (
											<Disclosure.Button
												key={item.name}
												as="a"
												href={item.href}
												className={`block rounded-md px-3 py-2 text-base font-medium 
										${
											location.pathname === item.href
												? "bg-sky-800 text-white"
												: "text-sky-800 hover:bg-sky-700 hover:text-white"
										}
											
										`}
												aria-current={item.current ? "page" : undefined}
											>
												{item.name}
											</Disclosure.Button>
										))}
									</div>
								</Disclosure.Panel>
							</>
						)}
					</Disclosure>
				</div>
			)}
		</>
	);
}
