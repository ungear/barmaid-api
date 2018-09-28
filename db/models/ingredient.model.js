const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientScheme = new Schema({
  ingredientName: String,
  description: String,
  type: String
});

module.exports.Ingredient = mongoose.model("ingredients", IngredientScheme);
