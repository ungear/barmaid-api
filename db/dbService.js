const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const dbUrl = require("./dbConfig.js").DB_URL;
const Schema = mongoose.Schema;

const DrinkScheme = new Schema({
  name: String,
  id: Number,
  thumbImageUrl: String,
  alcType: String,
  glass: String,
  instructions: String
});
const Drink = mongoose.model("drinks", DrinkScheme);

const IngredientScheme = new Schema({
  ingredientName: String
});
const Ingredient = mongoose.model("ingredients", IngredientScheme);

exports.upsertDrinks = function(drinks) {
  mongoose.connect(
    dbUrl,
    { useNewUrlParser: true }
  );
  let upsertPromises = drinks.map(drinkData => {
    let drink = {
      name: drinkData.strDrink,
      id: drinkData.idDrink,
      thumbImageUrl: drinkData.strDrinkThumb,
      alcType: drinkData.strAlcoholic,
      glass: drinkData.strGlass,
      instructions: drinkData.strInstructions
    };
    return Drink.update({ id: drink.id }, drink, { upsert: true });
  });

  return Promise.all(upsertPromises)
    .then(_ => {
      debugger;
      mongoose.disconnect();
    })
    .catch(e => {
      debugger;
      mongoose.disconnect();
    });
};

exports.getDrinkNames = function({ like }) {
  mongoose.connect(
    dbUrl,
    { useNewUrlParser: true }
  );
  let query = like
    ? Drink.find({ name: new RegExp(like, "i") }, "name")
    : Drink.find({}, "name");

  return query
    .exec()
    .then(results => {
      mongoose.disconnect();
      return results.map(x => x.name);
    })
    .catch(e => {
      mongoose.disconnect();
    });
};

exports.upsertIngredients = function(ingredients) {
  mongoose.connect(
    dbUrl,
    { useNewUrlParser: true }
  );
  let upsertPromises = ingredients.map(ingData => {
    let ingredient = {
      ingredientName: ingData.strIngredient1
    };
    return Ingredient.update(
      { ingredientName: ingredient.ingredientName },
      ingredient,
      { upsert: true }
    );
  });

  return Promise.all(upsertPromises)
    .then(_ => {
      mongoose.disconnect();
    })
    .catch(e => {
      mongoose.disconnect();
    });
};
