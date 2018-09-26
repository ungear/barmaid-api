const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const dbUrl = require("./dbConfig.js").DB_URL; //something like "mongodb://localhost:27017/awesomeDB" is expected
const Drink = require("./models/drink.model").Drink;
const Ingredient = require("./models/ingredient.model").Ingredient;

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
          dbAllIngredients.push(newIng);
          existingInredientId = newIng._id;
          await Ingredient.create(newIng);
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

exports.getAllIngredients = function() {
  mongoose.connect(
    dbUrl,
    { useNewUrlParser: true }
  );

  return Ingredient.find()
    .then(r => {
      mongoose.disconnect();
      return r;
    })
    .catch(e => {
      mongoose.disconnect();
    });
};
