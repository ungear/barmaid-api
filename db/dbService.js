const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const dbUrl = require("./dbConfig.js").DB_URL; //something like "mongodb://localhost:27017/awesomeDB" is expected
const Schema = mongoose.Schema;
const Drink = require("./models/drink.model").Drink;

const IngredientScheme = new Schema({
  ingredientName: String
});
const Ingredient = mongoose.model("ingredients", IngredientScheme);

exports.upsertDrinks = async function(drinks) {
  mongoose.connect(
    dbUrl,
    { useNewUrlParser: true }
  );
  let dbAllIngredients = [];
  let upsertPromises = drinks.map(async sourceDrink => {
    let dbDrinkIngredients = [];
    for (let index = 1; index <= 15; index++) {
      let sourceDrinkIngName = sourceDrink["strIngredient" + index];
      if (sourceDrinkIngName) {
        let existingInredient = dbAllIngredients.find(x => x.ingredientName === sourceDrinkIngName);
        let existingInredientId;
        if (existingInredient) {
          existingInredientId = existingInredient._id;
        } else {
          let newIng = {
            ingredientName: sourceDrinkIngName,
            _id: new ObjectID()
          };
          await Ingredient.create(newIng);
          dbAllIngredients.push(newIng);
          existingInredientId = newIng._id;
        }
        dbDrinkIngredients.push({
          ingId: existingInredientId,
          measure: sourceDrink["strMeasure" + index]
        });
      }
    }
    let drink = {
      name: sourceDrink.strDrink,
      id: sourceDrink.idDrink,
      thumbImageUrl: sourceDrink.strDrinkThumb,
      alcType: sourceDrink.strAlcoholic,
      glass: sourceDrink.strGlass,
      instructions: sourceDrink.strInstructions,
      ingredients: dbDrinkIngredients
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
  let query = like ? Drink.find({ name: new RegExp(like, "i") }, "name") : Drink.find({}, "name");

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
    return Ingredient.update({ ingredientName: ingredient.ingredientName }, ingredient, {
      upsert: true
    });
  });

  return Promise.all(upsertPromises)
    .then(_ => {
      mongoose.disconnect();
    })
    .catch(e => {
      mongoose.disconnect();
    });
};
