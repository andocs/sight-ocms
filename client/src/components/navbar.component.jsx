import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import decode from "jwt-decode";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Services", href: "/services" },
	{ name: "About", href: "/about" },
	{ name: "Technology", href: "/technology" },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const user = localStorage.getItem("user");

	const onLogout = () => {
		dispatch(logout());
		dispatch(reset());
		navigate("/");
	};

	const token = localStorage.getItem("user");
	let role = null;
	if (token) {
		const decodedToken = decode(token);
		role = decodedToken.user.role;
	}

	const updatedNavigation = user
		? [...navigation, { name: "Dashboard", href: `/${role}` }]
		: [...navigation, { name: "Login", href: "/login" }];

	const isDashboardRoute = [
		"/admin",
		"/patient",
		"/doctor",
		"/technician",
	].some((route) => location.pathname.startsWith(route));

	return (
		<div id="navbar" className="z-40 sticky w-full bg-white">
			<Disclosure as="nav">
				{({ open }) => (
					<>
						<div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8 border-b-2 border-slate-300">
							<div className="relative flex h-32 items-center justify-between">
								<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
									{/* Mobile menu button*/}
									<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-sky-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
										<span className="sr-only">Open main menu</span>
										{open ? (
											<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
										) : (
											<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
										)}
									</Disclosure.Button>
								</div>
								<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
									<a href="/home" className="z-50 flex-none lg:max-w-xs px-6">
										<img
											className="block h-8 w-auto lg:hidden"
											src="/images/sight-logo.png"
											alt="Your Company"
										/>
										<p className="hidden h-14 w-auto lg:block font-semibold text-xl break-words">
											{" "}
											OPTICAL CLINIC MANAGEMENT SYSTEM
										</p>
									</a>
									<div className="absolute w-full">
										<div className="hidden sm:ml-6 sm:flex grow sm:place-items-center justify-center relative">
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
																className={classNames(
																	location.pathname === item.href
																		? "bg-sky-800 text-white"
																		: "text-sky-800 hover:bg-gray-400 hover:text-white",
																	"rounded-md px-3 py-2 text-xl font-medium"
																)}
																aria-current={item.current ? "page" : undefined}
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
								{!user ? null : (
									<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
										<button
											type="button"
											className="rounded-full bg-slate-50 p-1 text-sky-800 hover:text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-800 focus:ring-offset-2"
										>
											<span className="sr-only">View notifications</span>
											<BellIcon className="h-6 w-6" aria-hidden="true" />
										</button>

										{/* Profile dropdown */}
										<Menu as="div" className="relative ml-3">
											<div>
												<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
													<span className="sr-only">Open user menu</span>
													<img
														className="h-8 w-8 rounded-full"
														src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
														alt=""
													/>
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
												<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													<Menu.Item>
														{({ active }) => (
															<a
																href="#"
																className={classNames(
																	active ? "bg-gray-100" : "",
																	"block px-4 py-2 text-sm text-gray-700"
																)}
															>
																Your Profile
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																href="#"
																className={classNames(
																	active ? "bg-gray-100" : "",
																	"block px-4 py-2 text-sm text-gray-700"
																)}
															>
																Settings
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																href="#"
																className={classNames(
																	active ? "bg-gray-100" : "",
																	"block px-4 py-2 text-sm text-gray-700"
																)}
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

						<Disclosure.Panel className="sm:hidden">
							<div className="space-y-1 px-2 pb-3 pt-2">
								{navigation.map((item) => (
									<Disclosure.Button
										key={item.name}
										as="a"
										href={item.href}
										className={classNames(
											item.current
												? "bg-gray-900 text-white"
												: "text-gray-300 hover:bg-gray-700 hover:text-white",
											"block rounded-md px-3 py-2 text-base font-medium"
										)}
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
	);
}
