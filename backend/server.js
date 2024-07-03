const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const cors = require("cors");
const dotenv = require("dotenv").config();
const multer = require("multer");

connectDb();
const app = express();

// Error handler middleware for Multer errors
const handleMulterErrors = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		return res.status(400).json({ message: err.message });
	}

	next(err);
};

const port = process.env.PORT || 5000;
app.use(cors(
	{
		origin: ["https://sight-sigma.vercel.app"],
		methods: ["POST", "GET", "DELETE", "UPDATE"],
		credentials: true
	}
));
app.use(express.json());

app.use(errorHandler);

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/technician", require("./routes/technicianRoutes"));
app.use("/api/patient", require("./routes/patientRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));

app.use(handleMulterErrors);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
