const restrictToDoctor = (req, res, next) => {
	// Check if the user has doctor role
	if (req.user.role !== "doctor") {
		return res.status(403).json({
			message: "Access denied. You are not authorized to perform this action.",
		});
	}
	next();
};

module.exports = restrictToDoctor;
