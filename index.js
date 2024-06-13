const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const dbConnect = require("./dbConnect");
const authRoutes = require("./auth/routes");
const userRoutes = require("./users/routes");
const productRoutes = require("./products/routes");
const folderRoutes = require("./folders/routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
dbConnect();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files in the `public` folder
app.use(express.static("./public"));

// Routes
app.get("/", (req, res) => res.send({ message: "Dev API up and running 🚀" }));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/folders", folderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
