// middlewares/validatePassword.js
module.exports = (req, res, next) => {
  const { password } = req.body;
  const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  if (!valid) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include upper, lower, number, and special character.",
    });
  }
  next();
};