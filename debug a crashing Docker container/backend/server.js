const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ENV Variables ---
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/notesdb";

// SABOTAGE 1: Simulating a missing critical environment variable
// if (!process.env.SUPER_SECRET_KEY) {
//     throw new Error("CRITICAL FAILURE: System cannot boot. SUPER_SECRET_KEY is missing!");
// }

// --- MongoDB Connection ---
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const noteSchema = new mongoose.Schema(
  { title: { type: String, required: true }, content: { type: String, required: true } },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/api/notes", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});
app.post("/api/notes", async (req, res) => {
  const note = new Note({ title: req.body.title, content: req.body.content });
  await note.save();
  res.status(201).json(note);
});
app.delete("/api/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));