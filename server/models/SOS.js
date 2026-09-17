const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
  {
    sosId: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },

      accuracy: {
        type: Number,
        default: null,
      },
    },

    message: {
      type: String,
      default: "Emergency assistance may be required.",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Resolved", "Cancelled"],
      default: "Active",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SOS", sosSchema);