import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
	getScheduleList,
	reset,
	clear,
} from "../../features/schedule/scheduleSlice";

import Spinner from "../../components/spinner.component";
import ViewAllDoctors from "../../components/viewdoctors.component";
function ViewDoctors() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const goBack = () => {
		navigate("/patient");
	};

	const { schedule, isLoading } = useSelector((state) => state.schedule);

	useEffect(() => {
		dispatch(getScheduleList());
		return () => {
			dispatch(reset());
			dispatch(clear());
		};
	}, [dispatch]);

	if (isLoading) {
		return <Spinner />;
	}
	return (
		schedule && (
			<>
				<ViewAllDoctors data={schedule} onClick={goBack} />
			</>
		)
	);
}

export default ViewDoctors;
