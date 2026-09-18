const express = require("express");
const crypto = require("crypto");

const Report = require("../models/Report");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ==========================================
// CREATE A NEW HAZARD REPORT
// ==========================================

router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    upload.single("photo")(req, res, (error) => {
      if (error) {
        console.error("Photo upload error:", error);

        return res.status(400).json({
          message: error.message || "Photo upload failed",
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const {
        title,
        category,
        severity,
        riskTime,
        description,
        location,
        anonymous,
      } = req.body;

      let parsedLocation;

      try {
        parsedLocation =
          typeof location === "string"
            ? JSON.parse(location)
            : location;
      } catch (error) {
        return res.status(400).json({
          message: "Invalid location data",
        });
      }

      // -------------------------------
      // Validate required fields
      // -------------------------------

      if (!title || !title.trim()) {
        return res.status(400).json({
          message: "Hazard title is required",
        });
      }

      if (!category) {
        return res.status(400).json({
          message: "Hazard category is required",
        });
      }

      if (!severity) {
        return res.status(400).json({
          message: "Hazard severity is required",
        });
      }

      if (!description || !description.trim()) {
        return res.status(400).json({
          message: "Hazard description is required",
        });
      }

      if (!parsedLocation) {
        return res.status(400).json({
          message: "Hazard location is required",
        });
      }

      if (
        parsedLocation.latitude === undefined ||
        parsedLocation.longitude === undefined
      ) {
        return res.status(400).json({
          message: "Latitude and longitude are required",
        });
      }

      // -------------------------------
      // Generate report ID
      // -------------------------------

      const reportId =
        "RPT-" +
        Date.now() +
        "-" +
        crypto
          .randomBytes(3)
          .toString("hex")
          .toUpperCase();

      // -------------------------------
      // Create report
      // -------------------------------

      const report = await Report.create({
        reportId,

        userId: req.user.userId,

        title: title.trim(),

        category,

        severity,

        riskTime: riskTime || "",

        description: description.trim(),

        location: {
          address: parsedLocation.address || "",
          latitude: Number(parsedLocation.latitude),
          longitude: Number(parsedLocation.longitude),
        },

        photo: {
          url: req.file
            ? `/uploads/${req.file.filename}`
            : "",
          fileName: req.file
            ? req.file.originalname
            : "",
        },

        anonymous:
          anonymous === true ||
          anonymous === "true",

        status: "Pending",
      });

      // -------------------------------
      // Send response
      // -------------------------------

      res.status(201).json({
        message:
          "Hazard report submitted successfully",

        report: {
          id: report._id,
          reportId: report.reportId,
          title: report.title,
          category: report.category,
          severity: report.severity,
          status: report.status,
          createdAt: report.createdAt,
        },
      });

    } catch (error) {
      console.error(
        "Create report error:",
        error
      );

      res.status(500).json({
        message:
          "Server error while creating hazard report",
      });
    }
  }
);

// ==========================================
// DELETE REPORT - ADMIN ONLY
// ==========================================
// Delete a report created by the logged-in user
router.delete(
  "/my/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);

      if (!report) {
        return res.status(404).json({
          message: "Report not found",
        });
      }

      // Make sure the report belongs to the logged-in user
      if (report.userId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You can only delete your own reports",
        });
      }

      await Report.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Report deleted successfully",
      });
    } catch (error) {
      console.error("User delete report error:", error);

      res.status(500).json({
        message: "Server error while deleting report",
      });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);

      if (!report) {
        return res.status(404).json({
          message: "Report not found",
        });
      }

      await Report.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Report deleted successfully",
      });
    } catch (error) {
      console.error("Delete report error:", error);

      res.status(500).json({
        message: "Server error while deleting report",
      });
    }
  }
);
// ==========================================
// UPDATE REPORT STATUS - ADMIN ONLY
// ==========================================

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      // Validate status
      if (!["Verified", "Rejected", "Pending"].includes(status)) {
        return res.status(400).json({
          message: "Invalid report status",
        });
      }

      // Find report
      const report = await Report.findById(req.params.id);

      if (!report) {
        return res.status(404).json({
          message: "Report not found",
        });
      }

      // Update status
      report.status = status;

      await report.save();

      res.status(200).json({
        message: `Report ${status.toLowerCase()} successfully`,
        report,
      });
    } catch (error) {
      console.error("Update report status error:", error);

      res.status(500).json({
        message: "Server error while updating report status",
      });
    }
  }
);

// ==========================================
// GET ALL REPORTS - ADMIN ONLY
// ==========================================

router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const reports = await Report.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "All reports fetched successfully",
        reports,
      });
    } catch (error) {
      console.error("Fetch all reports error:", error);

      res.status(500).json({
        message: "Server error while fetching reports",
      });
    }
  }
);
// ==========================================
// GET MY REPORTS - LOGGED-IN USER
// ==========================================

router.get(
  "/my-reports",
  authMiddleware,
  async (req, res) => {
    try {
      const reports = await Report.find({
        userId: req.user.userId,
      })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "My reports fetched successfully",
        reports,
      });
    } catch (error) {
      console.error("Fetch my reports error:", error);

      res.status(500).json({
        message: "Server error while fetching your reports",
      });
    }
  }
);
// ==========================================
// GET VERIFIED REPORTS - PUBLIC
// ==========================================

router.get("/verified", async (req, res) => {
  try {
    const reports = await Report.find({
      status: "Verified",
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Verified reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error(
      "Fetch verified reports error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching verified reports",
    });
  }
});

module.exports = router;
