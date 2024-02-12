const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_HEADER = process.env.TOKEN_HEADER_KEY;

function verifyAuth(req, res, next) {
  const token = req.header(JWT_HEADER);
  if (!token)
    return res.status(401).json({ success: false, message: "Access denied" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ success: false, message: "Invalid token", error: error });
  }
}

module.exports = verifyAuth;
