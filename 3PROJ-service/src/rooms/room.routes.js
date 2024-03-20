const express = require("express");
const router = express.Router();
const roomController = require("./room.controller");
const { body, param } = require("express-validator");

/// create a Room
router.post(
  "/add",
  [],
  roomController.AddRoom
);// no protection

/// get list of all Room
router.get(
  "/",
  [],
  roomController.GetAllRoom
);// no protection

/// get Room by id
router.get(
  "/:roomId",
  [param("roomId").isMongoId().withMessage("Invalid room ID"),],
  roomController.GetRoomById
);// no protection

/// update Room by id
router.patch(
  "/updateRoom/:roomId",
  [param("roomId").isMongoId().withMessage("Invalid room ID"),],
  roomController.updateRoomById
);// Owner + co-Owner

/// delete Room by id
router.delete(
  "/deleteRoom/:roomId",
  [param("roomId").isMongoId().withMessage("Invalid room ID"),],
  roomController.deleteRoomById
);// Owner + co-Owner

module.exports = router;
