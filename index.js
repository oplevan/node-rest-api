const express = require("express");
const cors = require("cors");
const dbConnect = require("./dbConnect");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require("./users/routes");

dbConnect();

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,DELETE,PUT,PATCH",
    optionsSuccessStatus: 200,
  })
);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
