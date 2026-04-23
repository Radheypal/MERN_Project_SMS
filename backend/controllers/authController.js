const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, rollNo, class: cls, phone } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name, email, password: hashedPassword, rollNo, class: cls, phone
    });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, student: { id: student._id, name: student.name, email: student.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, student: { id: student._id, name: student.name, email: student.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
