const express = require("express");
const router = express.Router();
const taskController = require("./task.controller.js");
const { body, param } = require("express-validator");

/// create a Task
router.post(
  "/add",
  [],
  taskController.AddTask
);// Owner + co-Owner

/// get list of all Task
router.get(
  "/",
  [],
  taskController.GetAllTask
);// Owner + co-Owner + User

/// get Task by id
router.get(
  "/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  taskController.GetTaskById
);// Owner + co-Owner + User

/// update Task by id
router.patch(
  "/updateTask/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  taskController.updateTaskById
);// Owner + co-Owner

/// delete Task by id
router.delete(
  "/deleteTask/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  taskController.deleteTaskById
);// Owner + co-Owner


/// update by adding render
router.patch(
  "/addRender/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  taskController.updateTaskById
);// User

/// update by adding correction
router.patch(
  "/addCorrection/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  taskController.updateTaskById
);// Owner + co-Owner

module.exports = router;
