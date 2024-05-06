const express = require("express");
const router = express.Router();
const taskController = require("./task.controller.js");
const { body, param } = require("express-validator");
const authController = require("../auth.controller");

/// create a Task
router.post(
  "/add",
  [],
  authController.protect,
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
  authController.protect,
  taskController.GetTaskById
);// Owner + co-Owner + User

/// update Task by id
router.post(
  "/updateTask/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  authController.protect,
  taskController.updateTaskById
);// Owner + co-Owner

/// delete Task by id
router.delete(
  "/deleteTask/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  authController.protect,
  taskController.deleteTaskById
);// Owner + co-Owner


/// update by adding render
router.post(
  "/addRender/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  authController.protect,
  taskController.AddRender
);// User

/// update by adding render
router.post(
  "/updateNote/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  authController.protect,
  taskController.UpdateNoteRender
);// User

/// update by adding correction
router.post(
  "/addCorrection/:taskId",
  [param("taskId").isMongoId().withMessage("Invalid task ID"),],
  authController.protect,
  taskController.updateTaskById
);// Owner + co-Owner

module.exports = router;
