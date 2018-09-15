const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const dbUrl = require("./dbConfig.js").DB_URL;
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
  // ingredients: {
  //   type: Map,
  //   of: String
  // }
});
const Drink = mongoose.model("drinks", DrinkScheme);

const IngredientScheme = new Schema({
  ingredientName: String
});
const Ingredient = mongoose.model("ingredients", IngredientScheme);

exports.upsertDrinks = async function(drinks) {
  mongoose.connect(
    dbUrl,
    { useNewUrlParser: true }
  );
  let allIngredients = await Ingredient.find({});
  let upsertPromises = drinks.map(drinkData => {
    let ings = [];
    for (let index = 1; index <= 15; index++) {
      let ingName = drinkData["strIngredient" + index];
      if (ingName) {
        let existingInredient = allIngredients.find(
          x => x.ingredientName === ingName
        );
        if (existingInredient) {
          let ingId = allIngredients.find(x => x.ingredientName === ingName)
            ._id;
          ings.push({ ingId, measure: drinkData["strMeasure" + index] });
        } else {
          console.log("Not found in db " + ingName);
        }
      }
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
