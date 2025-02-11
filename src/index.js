const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.js");
const tanyaShoppingAssistant = require("./routes/tanyaShoppingAssistant.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api", authRoutes);
app.use("/api", tanyaShoppingAssistant);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
