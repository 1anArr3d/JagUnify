import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  const text = String(message || "").toLowerCase();

  // Simulate latency
  await new Promise(r => setTimeout(r, 500));

  // Simple rules to prove the UI works
  if (text.includes("apply") || text.includes("admission")) {
    return res.json({
      reply: "You can start an application from the Admissions section. Would you like undergraduate or graduate info?",
      sources: [{ title: "Admissions", url: "https://www.tamusa.edu/" }],
      suggestions: ["Undergraduate", "Graduate", "Deadlines"]
    });
  }

  if (text.includes("tuition") || text.includes("cost")) {
    return res.json({
      reply: "Tuition varies by program and credit hours. I can point you to cost/aid resources—what program are you looking at?",
      sources: [{ title: "Tuition & Aid", url: "https://www.tamusa.edu/" }]
    });
  }

  return res.json({
    reply: "I’m not sure yet, but I can help you find the right page. What topic is this: admissions, financial aid, registration, or IT help?",
    sources: [{ title: "TAMUSA Home", url: "https://www.tamusa.edu/" }]
  });
});

app.listen(3001, () => {
  console.log("Mock chat API listening on http://localhost:3001/chat");
});