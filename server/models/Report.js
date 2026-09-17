const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // Unique report ID
    reportId: {
      type: String,
      unique: true,
      required: true,
    },

    // User who submitted the report
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Hazard title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Type of hazard
    category: {
      type: String,
      required: true,
      enum: [
        "Poor Street Lighting",
        "Damaged Road",
        "Pothole",
        "Waterlogging",
        "Accident-Prone Area",
        "Fallen Tree",
        "Unsafe Area",
        "Other Safety Hazard",
      ],
    },

    // Severity of hazard
    severity: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },

    // Time when the hazard is risky
    riskTime: {
      type: String,
      default: "",
      trim: true,
    },

    // Description of the hazard
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Location information
    location: {
      address: {
        type: String,
        default: "",
        trim: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    // Photo information
    // Actual image upload will be connected later.
    photo: {
      url: {
        type: String,
        default: "",
      },

      fileName: {
        type: String,
        default: "",
      },
    },

    // Whether the user's identity should be hidden from other users
    anonymous: {
      type: Boolean,
      default: false,
    },

    // Admin will later verify/reject reports
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);