import jwt from "jsonwebtoken";

// verifyJWT - Middleware to verify the JWT token.
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if token is in authorization headers.
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Pick the token from the authorization header.
  const token = authHeader.split(" ")[1];

  // Verify the token.
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "An error occured: Forbidden" });
    req.user = decoded.UserInfo.username;
    req.email = decoded.UserInfo.email;
    next();
  });
};

export default verifyJWT;
