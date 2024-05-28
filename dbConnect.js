// external imports
const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.DB_CONNECTION_STR;

async function dbConnect() {
  mongoose.connect(connectionString);

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Successfully connected to MongoDB Atlas!");
  });
}

module.exports = dbConnect;
