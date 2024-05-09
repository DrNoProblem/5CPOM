const Draw = require("./draw.model");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.GetAllDraws = async (req, res, next) => {
  try {
    const draw = await Draw.find();
    res.json(draw);
  } catch (err) {
    next(err);
  }
};

exports.AddDraw = async (req, res, next) => {
  try {
    const { script } = req.body;
    let existingDraw;
    try {
      existingDraw = await Draw.findOne({ owner: req.userId, script: script });
    } catch (err) {
      return next(err);
    }
    if (existingDraw) throw new AppError("already exist", 400);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", message: "Validation error", errors: errors.array() });
    }
    const newDraw = await Draw.create({ owner: req.userId, script: script });
    res.status(201).json({
      status: "success",
      data: newDraw,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateDrawById = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.drawnId);
    draw.script = req.body.script;
    await draw.save();
    res.json(draw);
  } catch (err) {
    next(err);
  }
};
exports.deleteDrawById = async (req, res, next) => {
  try {
    let message = "";
    let token = req.token;
    if (!token) return res.status(400).send({ message: `You are not logged in! Please log in to get access` });
    try {
      const deleteDraw = await Draw.findByIdAndDelete(req.params.drawnId);
      if (!deleteDraw) return res.status(400).send({ message: `Draw with id : '${deleteDraw._id}' not found` });
      else message += `\n Draw with id : '${deleteDraw._id}' deleted successfully`;
    } catch (err) {
      next(err);
    }
    res.json({ message: message });
  } catch (err) {
    next(err);
  }
};
