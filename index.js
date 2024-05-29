const express = require("express");
// const cors = require("cors");
const dbConnect = require("./dbConnect");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require("./auth/routes");
const userRoutes = require("./users/routes");
const productRoutes = require("./products/routes");

dbConnect();

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
