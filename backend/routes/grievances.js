const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  submitGrievance, getAllGrievances, getGrievanceById,
  updateGrievance, deleteGrievance, searchGrievance
} = require("../controllers/grievanceController");

const router = express.Router();

router.use(protect);

router.get("/search", searchGrievance);
router.post("/", submitGrievance);
router.get("/", getAllGrievances);
router.get("/:id", getGrievanceById);
router.put("/:id", updateGrievance);
router.delete("/:id", deleteGrievance);

module.exports = router;
