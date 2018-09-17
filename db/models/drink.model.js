const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DrinkScheme = new Schema({
  //id: ObjectId,
  name: String,
  id: Number,
  thumbImageUrl: String,
  alcType: String,
  glass: String,
  instructions: String,
  ingredients: [
    new Schema({
      ingId: { type: mongoose.Schema.ObjectId, ref: "ingredients" },
      measure: String
    })
  ]
});
module.exports.Drink = mongoose.model("drinks", DrinkScheme);
