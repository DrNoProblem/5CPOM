const Room = require("./room.model");
const Task = require("../tasks/task.model");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.AddRoom = async (req, res, next) => {
  try {
    const { name, co_owner, users } = req.body;
    let existingRoom;
    try {
      existingRoom = await Room.findOne({ name });
    } catch (err) {
      return next(err);
    }
    if (existingRoom) throw new AppError("name already in use", 400);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", message: "Validation error", errors: errors.array() });
    }
    const newRoom = await Room.create({ name, owner: req.user.id, co_owner, users, tasks: [""] });
    res.status(201).json({
      status: "success",
      data: {
        user: newRoom,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.GetAllRoom = async (req, res, next) => {
  try {
    const room = await Room.find();
    res.json(room);
  } catch (err) {
    next(err);
  }
};
exports.GetRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.room._id);
    res.json(room);
  } catch (err) {
    next(err);
  }
};
exports.updateRoomById = async (req, res, next) => {
  const roomId = req.params.roomId;
  const updates = req.body;
  try {
    if (Object.keys(updates).length === 0) return res.status(400).send({ message: "No updates provided" });
    const room = await Room.findByIdAndUpdate(roomId, updates, { new: true, runValidators: true });
    if (!room) return res.status(404).send({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    next(err);
  }
};
exports.deleteRoomById = async (req, res, next) => {
  try {
    let message = "";
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    room.tasks.forEach(async (task) => {
      try {
        const deleteTask = await Task.findByIdAndDelete(task._id);
        if (!deleteTask) message += `\n Task with id : '${task._id}' not found`;
        else message += `\n Task with id : '${task._id}' deleted successfully`;
      } catch (err) {
        next(err);
      }
    });
    message += `\n Room deleted successfully`;
    res.json({ message: message });
  } catch (err) {
    next(err);
  }
};
