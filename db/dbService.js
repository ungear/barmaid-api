const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const dbUrl = require('./dbConfig.js').DB_URL;
const Schema = mongoose.Schema;

const DrinkScheme = new Schema({
  name: String,
  _id: Number,
})
const Drink = mongoose.model("drinks", DrinkScheme);

exports.upsertDrinks = function(drinks){
  mongoose.connect(dbUrl,{ useNewUrlParser: true });
  console.log(drinks)
  let upsertPromises = drinks.map(drinkData => {
    let drink = {
      name: drinkData.strDrink,
      _id: drinkData.idDrink,
    }
    return Drink.update({_id: drink._id}, drink, {upsert: true})
  })

  return Promise.all(upsertPromises)
    .then(_ => {debugger; mongoose.disconnect()})
    .catch(e => {debugger; mongoose.disconnect()})
}