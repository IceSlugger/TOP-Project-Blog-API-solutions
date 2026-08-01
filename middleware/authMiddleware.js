const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });

const requireAuthor = (req, res, next) => {
  if (req.user && req.user.isAuthor) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: Author access required" });
};

module.exports = { requireAuth, requireAuthor };