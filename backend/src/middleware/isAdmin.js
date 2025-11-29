export const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    console.error("isAdmin error:", err.message);
    return res.status(500).json({ msg: "Server error in isAdmin middleware" });
  }
};
