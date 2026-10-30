require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

const cors = require("cors");
const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  });
}

module.exports = app;
