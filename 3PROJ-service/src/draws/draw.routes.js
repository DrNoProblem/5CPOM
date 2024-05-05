const express = require("express");
const router = express.Router();
const drawController = require("./draw.controller");
const { body, param } = require("express-validator");

/// get Draw by id
router.get(
    "/",
    [],
    drawController.GetAllDraws
  );

/// create a Draw
router.post(
  "/add",
  [],
  drawController.AddDraw
);

/// update Draw by id
router.patch(
    "/updateDraw/:drawnId",
    [param("drawnId").isMongoId().withMessage("Invalid drawn ID"),],
    drawController.updateDrawById
  );

/// delete Draw by id
router.delete(
    "/deleteDraw/:drawnId",
    [param("drawnId").isMongoId().withMessage("Invalid drawn ID"),],
    drawController.deleteDrawById
  );

module.exports = router;