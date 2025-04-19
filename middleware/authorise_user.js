// middleware/authorize.js
function authorize(role) {
  return (req, res, next) => {
    const user = req.session.user;
    if (!user || user.role !== role) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}

module.exports = authorize;
