const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  const token = tokenFromHeader || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Няма токен. Достъпът е отказан." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Невалиден токен." });
  }
};
