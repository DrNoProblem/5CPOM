const Task = require("./task.model");
const Room = require("..rooms/room.model");

exports.AddTask = async (req, res, next) => {
  try {
    const { title, details, datelimit, roomId } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", message: "Validation error", errors: errors.array() });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const newTask = await Task.create({ title, details, datelimit });

    room.task += `${room.task === "" ? "" : ","}${newTask._id}`;
    await room.save();

    res.status(201).json({
      status: "success",
      data: {
        user: newTask,
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
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
