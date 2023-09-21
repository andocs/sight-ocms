const restrictToTechnician = (req, res, next) => {
	if (req.user.role !== "patient") {
		return res.status(403).json({
			message: "Access denied. You are not authorized to perform this action.",
		});
	}
	next();
};

module.exports = restrictToTechnician;
