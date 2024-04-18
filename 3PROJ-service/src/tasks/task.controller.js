const Task = require("./task.model");
const Room = require("../rooms/room.model");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
exports.AddTask = async (req, res, next) => {
  try {
    const { title, details, datelimit, roomId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", message: "Validation error", errors: errors.array() });
    }
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("You are not logged in! Please log in to get access.", 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (decoded.id !== room.owner && decoded.id !== room.co_owner) return res.status(404).json({ message: "Not permitted" });
    const newTask = await Task.create({ title, details, datelimit, render: [] });
    room.tasks = [...room.tasks, newTask.id];
    await room.save();
    res.status(201).json({
      status: "success",
      data: {
        task: newTask,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.GetAllTask = async (req, res, next) => {
  try {
    const task = await Task.find();
    res.json(task);
  } catch (err) {
    next(err);
  }
};
exports.GetTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.task._id);
    res.json(task);
  } catch (err) {
    next(err);
  }
};
exports.updateTaskById = async (req, res, next) => {
  try {
    const task = "";
    res.json(task);
  } catch (err) {
    next(err);
  }
};
exports.deleteTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
exports.AddRender = async (req, res, next) => {
  try {
    const { render, roomId } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
      token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new AppError("You are not logged in! Please log in to get access.", 401));
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (decoded.id === room.owner || decoded.id === room.co_owner)
      return res.status(404).json({ message: "You can not submit a render as owner or co-owner for this room" });
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.renders.some((render) => render.id === decoded.id)) {
      return res.status(400).json({ message: "Render already submit" });
    }
    task.renders = [...task.renders, { id: decoded.id, script: render, note: 0 }];
    await task.save();
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

exports.UpdateNoteRender = async (req, res, next) => {
  try {
    const { roomId, updates } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
      token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new AppError("You are not logged in! Please log in to get access.", 401));
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (decoded.id === room.owner || decoded.id === room.co_owner)
      return res.status(404).json({ message: "You can not submit a render as owner or co-owner for this room" });
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    updates.forEach((update) => {
      const renderIndex = task.renders.findIndex((render) => render.id === update.userId);
      if (renderIndex !== -1) task.renders[renderIndex].note = update.note;
    });

    room.users.forEach((userId) => {
      if (!task.renders.some((render) => render.id === userId)) {
        task.renders.push({ id: userId, script: "", note: 0 });
      }
    });

    await task.save();
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};
