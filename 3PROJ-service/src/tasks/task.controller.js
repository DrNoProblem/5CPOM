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
    if (req.userId !== room.owner && req.userId !== room.co_owner) return res.status(404).json({ message: "Not permitted" });
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
    const taskId = req.params.taskId;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const roomsUpdated = await Room.updateMany(
      { tasks: taskId }, 
      { $pull: { tasks: taskId } } 
    );

    if (roomsUpdated.nModified > 0) {
      console.log(`${roomsUpdated.nModified} rooms have been updated to remove the task`);
    } else {
      console.log("No rooms needed updating.");
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error during task deletion:", err);
    next(err);
  }
};
exports.AddRender = async (req, res, next) => {
  try {
    const { render, roomId } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (req.userId === room.owner || req.userId === room.co_owner)
      return res.status(404).json({ message: "You can not submit a render as owner or co-owner for this room" });
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const renderIndex = task.renders.findIndex((r) => r.id === req.userId);
    if (renderIndex !== -1)
      task.renders.set(renderIndex, { id: req.userId, script: render, note: task.renders[renderIndex].note });
    else task.renders = [...task.renders, { id: req.userId, script: render, note: 0 }];

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
    if (req.userId === room.owner || req.userId === room.co_owner)
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
