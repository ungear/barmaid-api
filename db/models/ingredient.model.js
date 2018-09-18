const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientScheme = new Schema({
  ingredientName: String
});

module.exports.Ingredient = mongoose.model("ingredients", IngredientScheme);
