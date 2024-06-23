const jwt = require('jsonwebtoken');
const AppError = require('./utils/appError');
const { promisify } = require('util');


exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(400).json({ status: "fail", message: "log in to get access error", errors: errors.array() });
    req.user = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};
