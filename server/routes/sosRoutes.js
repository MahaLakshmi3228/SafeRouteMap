const express = require("express");
const crypto = require("crypto");

const SOS = require("../models/SOS");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
====================================================
CREATE SOS
POST /api/sos
====================================================
*/

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      accuracy,
      message,
    } = req.body;

    // Validate location
    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const acc =
      accuracy !== undefined
        ? Number(accuracy)
        : null;

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return res.status(400).json({
        message: "Invalid location coordinates",
      });
    }

    // Generate unique SOS ID
    const sosId =
      "SOS-" +
      Date.now() +
      "-" +
      crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    // Create SOS
    const sos = await SOS.create({
      sosId,

      userId: req.user.userId,

      location: {
        latitude: lat,
        longitude: lng,
        accuracy: acc,
      },

      message:
        message ||
        "Emergency assistance may be required.",

      status: "Active",
    });

    res.status(201).json({
      message: "SOS emergency created successfully",

      sos: {
        id: sos._id,
        sosId: sos.sosId,
        status: sos.status,
        location: sos.location,
        createdAt: sos.createdAt,
      },
    });
  } catch (error) {
    console.error("Create SOS error:", error);

    res.status(500).json({
      message: "Server error while creating SOS",
    });
  }
});


/*
====================================================
GET MY SOS HISTORY
GET /api/sos/my-sos
====================================================
*/

router.get(
  "/my-sos",
  authMiddleware,
  async (req, res) => {
    try {
      const sosRecords = await SOS.find({
        userId: req.user.userId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        message: "SOS history fetched successfully",
        sosRecords,
      });
    } catch (error) {
      console.error(
        "Fetch SOS history error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while fetching SOS history",
      });
    }
  }
);


/*
====================================================
RESOLVE SOS
PATCH /api/sos/:id/resolve
====================================================
*/

router.patch(
  "/:id/resolve",
  authMiddleware,
  async (req, res) => {
    try {
      const sos = await SOS.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      });

      if (!sos) {
        return res.status(404).json({
          message: "SOS incident not found",
        });
      }

      if (sos.status !== "Active") {
        return res.status(400).json({
          message:
            "Only an active SOS can be resolved",
        });
      }

      sos.status = "Resolved";
      sos.resolvedAt = new Date();

      await sos.save();

      res.status(200).json({
        message: "SOS resolved successfully",
        sos,
      });
    } catch (error) {
      console.error(
        "Resolve SOS error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while resolving SOS",
      });
    }
  }
);


/*
====================================================
CANCEL SOS
PATCH /api/sos/:id/cancel
====================================================
*/

router.patch(
  "/:id/cancel",
  authMiddleware,
  async (req, res) => {
    try {
      const sos = await SOS.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      });

      if (!sos) {
        return res.status(404).json({
          message: "SOS incident not found",
        });
      }

      if (sos.status !== "Active") {
        return res.status(400).json({
          message:
            "Only an active SOS can be cancelled",
        });
      }

      sos.status = "Cancelled";
      sos.cancelledAt = new Date();

      await sos.save();

      res.status(200).json({
        message: "SOS cancelled successfully",
        sos,
      });
    } catch (error) {
      console.error(
        "Cancel SOS error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while cancelling SOS",
      });
    }
  }
);


module.exports = router;