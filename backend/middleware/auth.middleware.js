import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
};
