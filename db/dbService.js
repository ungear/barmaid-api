const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const dbUrl = require("./dbConfig.js").DB_URL;
const Schema = mongoose.Schema;

const DrinkIngredient = new Schema({
  ingredientName: String,
  measure: String
});

const DrinkScheme = new Schema({
  name: String,
  id: Number,
  thumbImageUrl: String,
  alcType: String,
  glass: String,
  instructions: String,
  ingredients: {
    type: Map,
    of: DrinkIngredient
  }
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
    let ings = {};
    if (drinkData.strIngredient1) {
      ings["1"] = {
        ingredientName: drinkData.strIngredient1,
        measure: drinkData.strMeasure1
      };
    }
    if (drinkData.strIngredient2) {
      ings["2"] = {
        ingredientName: drinkData.strIngredient2,
        measure: drinkData.strMeasure2
      };
    }
    let drink = {
      name: drinkData.strDrink,
      id: drinkData.idDrink,
      thumbImageUrl: drinkData.strDrinkThumb,
      alcType: drinkData.strAlcoholic,
      glass: drinkData.strGlass,
      instructions: drinkData.strInstructions,
      ingredients: ings
    };
    return Drink.update({ id: drink.id }, drink, { upsert: true });
  });

  return Promise.all(upsertPromises)
    .then(_ => {
      debugger;
      mongoose.disconnect();
    })
    .catch(e => {
      console.error(e);
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
