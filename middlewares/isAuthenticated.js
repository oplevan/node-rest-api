const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // IF no auth headers are provided
    // THEN return 401 Unauthorized error
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header is missing" });
    }

    // IF bearer auth header is not provided
    // THEN return 401 Unauthorized error
    if (!authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Invalid auth mechanism." });
    }

    const token = authHeader.split(" ")[1];
    // console.log("Token: " + token);

    // IF bearer auth header is provided, but token is not provided
    // THEN return 401 Unauthorized error
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Token verification failed" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    // console.error("Authorization error:", error);
    res.status(401).json({ message: "Authorization failed!" });
  }
};
