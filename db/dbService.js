const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const dbUrl = require("./dbConfig.js").DB_URL; //something like "mongodb://localhost:27017/awesomeDB" is expected
const Drink = require("./models/drink.model").Drink;
const Ingredient = require("./models/ingredient.model").Ingredient;

exports.dropDb = async function(data) {
  return mongoose.createConnection(dbUrl, { useNewUrlParser: true }).dropDatabase();
};

exports.populateDb = async function(data) {
  mongoose.connect(
    dbUrl,
    { useNewUrlParser: true }
  );
  return Promise.all([Drink.create(data.drinks), Ingredient.create(data.ingredients)])
    .then(_ => {
      mongoose.disconnect();
    })
    .catch(e => {
      console.error(e);
      mongoose.disconnect();
    });
};
