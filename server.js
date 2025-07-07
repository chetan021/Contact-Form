require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const sendThankYouEmail = require('./sendEmail');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const Contact = mongoose.model("Contact", new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  submittedAt: { type: Date, default: Date.now }
}));

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: "All fields are required" });

  if (!isValidEmail(email))
    return res.status(400).json({ success: false, message: "Invalid email format" });

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    await sendThankYouEmail(email, name);

    res.json({ success: true, message: "Thank you for contacting us!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
