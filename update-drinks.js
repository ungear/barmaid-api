const grabber = require("./grabber/grabber.js");
const dbService = require("./db/dbService.js");

async function main() {
  // console.log("Getting ingredients...");
  // let ingredientsData = await grabber.getAllIngredients();
  // await dbService.upsertIngredients(ingredientsData);
  // console.log("Done");
  console.log("Getting drinks source data...");
  let grabbeerResult = await grabber.getAllDrinksFullData();
  if (!grabbeerResult.success) {
    console.log("Grabber error");
    console.log(grabbeerResult.error.response);
    return;
  }
  console.log(
    `Successfully got ${grabbeerResult.data.success.length} drinks. Failure ${
      grabbeerResult.data.failure.length
    }. Saving ...`
  );
  if (grabbeerResult.data.failure[0]) console.log(grabbeerResult.data.failure[0].response);
  await dbService.upsertDrinks(grabbeerResult.data.success);
  console.log("Done");
}

main();
