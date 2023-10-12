const restrictToStaff = (req, res, next) => {
	if (req.user.role !== "staff") {
		return res.status(403).json({
			message: "Access denied. You are not authorized to perform this action.",
		});
	}
	next();
};

module.exports = restrictToStaff;
