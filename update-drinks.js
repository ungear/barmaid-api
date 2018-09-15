const grabber = require("./grabber/grabber.js");
const dbService = require("./db/dbService.js");

async function main() {
  console.log("Getting ingredients...");
  let ingredientsData = await grabber.getAllIngredients();
  await dbService.upsertIngredients(ingredientsData);
  console.log("Done");
  console.log("Getting drinks...");
  await grabber
    .getAllDrinksFullData()
    .then(data => dbService.upsertDrinks(data));
  console.log("Done");
}

main();
