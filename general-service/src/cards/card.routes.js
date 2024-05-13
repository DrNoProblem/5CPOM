const express = require("express");
const router = express.Router();
const cardController = require("./card.controller");
const { body, param } = require("express-validator");

/// get Draw by id
router.get(
    "/",
    [],
    cardController.GetAllCards
  );

module.exports = router;