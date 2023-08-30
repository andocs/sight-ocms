import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../../features/auth/authSlice";
import PasswordInput from "../../components/passwordinput.component";
import decode from "jwt-decode";
import Spinner from "../../components/spinner.component";

function Register() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		conf_pass: "",
	});

	const { email, password, conf_pass } = formData;

	const token = localStorage.getItem("user");

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.auth
	);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}

		if (isSuccess) {
			toast.success(message);
			navigate("/home");
		}

		if (!isSuccess && token) {
			const decodedToken = decode(token);
			const role = decodedToken.user.role;
			navigate(`/${role}`);
		}

		dispatch(reset());

		if (isLoading) {
			return <Spinner />;
		}
	}, [user, isError, isSuccess, message, navigate, dispatch]);

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = (e) => {
		e.preventDefault();

		const userData = {
			email,
			password,
			conf_pass,
		};

		dispatch(register(userData));
	};

	return (
		<>
			<div className="mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8">
				<form onSubmit={onSubmit}>
					<div className="grid grid-cols-11 gap-4">
						<div className="col-start-1 col-span-3 row-span-6">
							<img
								src="/images/login-background.png"
								alt=""
								className="object-cover"
							/>
						</div>

						<div className="mb-10 col-start-4 col-span-8 row-start-1 row-span-1">
							<p className="text-9xl font-medium text-center">REGISTER</p>
						</div>

						<div className="col-start-6 row-start-2 col-span-4">
							<div className="mb-4 px-8">
								<label
									htmlFor="email"
									className="text-l text-center block w-full mb-2 text-sm font-medium text-sky-800"
								>
									EMAIL ADDRESS
								</label>
								<input
									type="email"
									placeholder="name@email.com"
									name="email"
									value={email}
									onChange={onChange}
									id="email"
									className="placeholder:underline placeholder:text-sky-800 text-center font-semibold block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div className="mb-4 px-8">
								<label
									htmlFor="password"
									className="text-l text-center block mb-2 text-sm font-medium text-sky-800"
								>
									PASSWORD
								</label>
								<PasswordInput
									text={"center"}
									value={password}
									onChange={(value) =>
										setFormData((prevState) => ({
											...prevState,
											password: value,
										}))
									}
								/>
							</div>

							<div className="px-8">
								<label
									htmlFor="password"
									className="text-l text-center block mb-2 text-sm font-medium text-sky-800"
								>
									CONFIRM PASSWORD
								</label>
								<PasswordInput
									text={"center"}
									value={conf_pass}
									onChange={(value) =>
										setFormData((prevState) => ({
											...prevState,
											conf_pass: value,
										}))
									}
								/>
							</div>
						</div>

						<div className="col-start-6 col-span-4 row-start-4 px-8">
							<button
								type="submit"
								className="w-full font-semibold text-white bg-sky-800 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-600 rounded-lg text-base px-6 py-3.5 text-center"
							>
								Sign Up
							</button>
							<div className="flex mt-3 justify-between">
								<p className="text-base font-semibold text-sky-400 hover:underline cursor-pointer">
									Already have an account?
								</p>
								<Link
									to="/login"
									className="text-base font-semibold text-sky-800 hover:underline cursor-pointer"
								>
									Sign In
								</Link>
							</div>

							<div className="inline-flex items-center justify-center w-full">
								<hr className="w-full h-px my-8 bg-gray-200 border-0" />
								<span className="absolute px-4 font-medium text-sky-800 bg-white">
									or
								</span>
							</div>
						</div>

						<div className="col-start-6 col-span-4 row-start-5 mb-4 px-8">
							<div className="px-16">
								<button
									type="button"
									className="font-light border border-sky-800 w-full text-sky-800 hover:bg-sky-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 rounded-lg text-sm px-6 py-3.5 text-center inline-flex justify-center mr-2 mb-2"
								>
									<svg
										className="w-4 h-4 mr-2 -ml-1 mt-0.5"
										xmlns="http://www.w3.org/2000/svg"
										width="705.6"
										height="720"
										viewBox="0 0 186.69 190.5"
									>
										<path
											fill="#4285f4"
											d="M95.25 77.932v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
										/>
										<path
											fill="#34a853"
											d="m41.869 113.38-6.972 5.337-24.679 19.223c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
										/>
										<path
											fill="#fbbc05"
											d="M10.218 52.561C3.724 65.376.001 79.837.001 95.25s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
										/>
										<path
											fill="#ea4335"
											d="M95.25 37.927c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276C142.442 9.439 120.968 0 95.25 0 58.016 0 25.891 21.388 10.218 52.561L41.91 77.153c7.533-22.514 28.575-39.226 53.34-39.226z"
										/>
									</svg>
									continue with Google
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default Register;
