const restrictToAdmin = (req, res, next) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({
			message: "Access denied. You are not authorized to perform this action.",
		});
	}
	// If the user has admin role, allow them to proceed
	next();
};

module.exports = restrictToAdmin;
