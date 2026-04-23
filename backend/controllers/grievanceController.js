const Grievance = require("../models/Grievance");

// Submit grievance
const submitGrievance = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const grievance = await Grievance.create({
      title, description, category, student: req.studentId
    });
    res.status(201).json(grievance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all grievances
const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.studentId }).sort({ createdAt: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get grievance by ID
const getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ _id: req.params.id, student: req.studentId });
    if (!grievance) return res.status(404).json({ message: "Grievance not found" });
    res.json(grievance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update grievance
const updateGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findOneAndUpdate(
      { _id: req.params.id, student: req.studentId },
      req.body,
      { new: true }
    );
    if (!grievance) return res.status(404).json({ message: "Grievance not found" });
    res.json(grievance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete grievance
const deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findOneAndDelete({ _id: req.params.id, student: req.studentId });
    if (!grievance) return res.status(404).json({ message: "Grievance not found" });
    res.json({ message: "Grievance deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search grievance by title
const searchGrievance = async (req, res) => {
  try {
    const { title } = req.query;
    const grievances = await Grievance.find({
      student: req.studentId,
      title: { $regex: title, $options: "i" }
    });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitGrievance, getAllGrievances, getGrievanceById, updateGrievance, deleteGrievance, searchGrievance };
