const grabber = require("./grabber/grabber.js");
const dbService = require("./db/dbService.js");

async function main() {
  console.log("Getting drinks source data...");
  try {
    let grabbeerResult = await grabber.getAllDrinksFullData();
    console.log(
      `Successfully got ${grabbeerResult.success.length} drinks. Failure ${grabbeerResult.failure.length}. Saving ...`
    );
    await dbService.upsertDrinks(grabbeerResult.success);
    console.log("Done");
  } catch (e) {
    console.log(e);
  }
}

main();
