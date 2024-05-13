const Draw = require("./card.model");

exports.GetAllCards = async (req, res, next) => {
  try {
    const draw = await Draw.find();
    res.json(draw);
  } catch (err) {
    next(err);
  }
};
