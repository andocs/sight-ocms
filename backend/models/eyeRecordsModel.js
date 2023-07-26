const mongoose = require("mongoose");

const eyeRecordSchema = new mongoose.Schema({
  
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rightEye: {
    sphere: {
      type: Number,
      // required: true
    },
    cylinder: {
      type: Number,
      // required: true
    },
    axis: {
      type: Number,
      // required: true
    }
  },
  leftEye: {
    sphere: {
      type: Number,
      // required: true
    },
    cylinder: {
      type: Number,
      // required: true
    },
    axis: {
      type: Number,
      // required: true
    }
  },
  additionalNotes: {
    type: String
  },
},
  {
    timestamps: true
  }
);

const EyeRecord = mongoose.model("EyeRecord", eyeRecordSchema, "recordDetails");

module.exports = EyeRecord;
