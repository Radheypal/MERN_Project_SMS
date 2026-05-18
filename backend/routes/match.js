const express = require("express");
const Candidate = require("../models/Candidate");
const router = express.Router();

// POST /api/match - Basic shortlisting logic
router.post("/", async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills = [] } = req.body;
    const candidates = await Candidate.find();

    const results = candidates.map(candidate => {
      const reqMatched = candidate.skills.filter(s =>
        requiredSkills.map(r => r.toLowerCase()).includes(s.toLowerCase())
      );
      const prefMatched = candidate.skills.filter(s =>
        preferredSkills.map(p => p.toLowerCase()).includes(s.toLowerCase())
      );

      const score = requiredSkills.length > 0
        ? (reqMatched.length / requiredSkills.length) * 100
        : 0;

      const expMet = candidate.experience >= minExperience;

      let rank = "Low";
      if (score >= 80 && expMet) rank = "High";
      else if (score >= 40 || expMet) rank = "Medium";

      return {
        ...candidate.toObject(),
        matchScore: Math.round(score),
        matchedSkills: reqMatched,
        preferredMatched: prefMatched,
        experienceMet: expMet,
        rank
      };
    })
    .filter(c => c.matchScore > 0 || c.experienceMet)
    .sort((a, b) => b.matchScore - a.matchScore);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
