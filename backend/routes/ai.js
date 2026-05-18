const express = require("express");
const Candidate = require("../models/Candidate");
const router = express.Router();

// POST /api/ai/shortlist - AI-based shortlisting using Gemini
router.post("/shortlist", async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills = [] } = req.body;
    const candidates = await Candidate.find();

    if (candidates.length === 0) {
      return res.status(400).json({ message: "No candidates found" });
    }

    const candidateList = candidates.map((c, i) =>
      `${i + 1}. ${c.name} - Skills: ${c.skills.join(", ")} - Experience: ${c.experience} years - Bio: ${c.bio || "N/A"}`
    ).join("\n");

    const prompt = `You are an expert HR recruiter. Analyze and rank these candidates for a job.

Job Requirements:
- Required Skills: ${requiredSkills.join(", ")}
- Minimum Experience: ${minExperience} years
- Preferred Skills: ${preferredSkills.join(", ") || "None"}

Candidates:
${candidateList}

For each candidate provide:
1. Rank (High/Medium/Low match)
2. Match Score (0-100%)
3. Why they are suitable or not
4. Top recommendation

Keep response structured and concise.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const aiResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI could not process the request.";

    res.json({ aiResult, totalCandidates: candidates.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/ai/interview-questions - Generate interview questions
router.post("/interview-questions", async (req, res) => {
  try {
    const { skills, name } = req.body;

    const prompt = `Generate 5 technical interview questions for a candidate named ${name} with skills: ${skills.join(", ")}. Keep questions practical and relevant.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const questions = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate questions.";
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
