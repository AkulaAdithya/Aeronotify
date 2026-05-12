import jwt from "jsonwebtoken";

/**
 * JWT authentication middleware.
 * Extracts the token from the Authorization header, verifies it,
 * and attaches the decoded admin payload to req.admin.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized — no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized — invalid token" });
  }
};

export default protect;
