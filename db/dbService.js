const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const dbUrl = require('./dbConfig.js').DB_URL;
const Schema = mongoose.Schema;

const DrinkScheme = new Schema({
  name: String,
  id: Number,
})
const Drink = mongoose.model("drinks", DrinkScheme);

exports.upsertDrinks = function(drinks){
  mongoose.connect(dbUrl,{ useNewUrlParser: true });
  console.log(drinks)
  let upsertPromises = drinks.map(drinkData => {
    let drink = {
      name: drinkData.strDrink,
      id: drinkData.idDrink,
    }
    return Drink.update({id: drink.id}, drink, {upsert: true})
  })

  return Promise.all(upsertPromises)
    .then(_ => {debugger; mongoose.disconnect()})
    .catch(e => {debugger; mongoose.disconnect()})
}

exports.getDrinkNames = function(){
  mongoose.connect(dbUrl,{ useNewUrlParser: true });
  return Drink.find({}, "name")
    .exec()
    .then(results => { 
      mongoose.disconnect(); 
      return results.map(x => x.name);})
    .catch(e => {
      mongoose.disconnect()
    })
}
