const grabber = require("./grabber/grabber.js");
const dbService = require("./db/dbService.js");

async function main() {
  // let ingredientsData = await grabber.getAllIngredients();
  // await dbService.upsertIngredients(ingredientsData);

  grabber.getAllDrinksFullData().then(data => dbService.upsertDrinks(data));
}

main();
