// middleware/authorize.js
function authorize(allowedRoles) {
  return (req, res, next) => {
    const user = req.session.user;

    // Check if the user is logged in
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    // Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied: Insufficient permissions." });
    }

    next();
  };
}

module.exports = authorize;
