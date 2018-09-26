const grabber = require("./grabber/grabber.js");
const dbService = require("./db/dbService.js");
const fs = require("fs");

async function main(isTesting) {
  console.log("Getting drinks source data...");
  try {
    let grabbeerResult = isTesting
      ? { success: require("./source-drinks-data.json"), failure: [] }
      : await grabber.getAllDrinksFullData();

    if (grabbeerResult.failure.length === 0) {
      await fs.writeFileSync("./source-drinks-data.json", JSON.stringify(grabbeerResult.success));
    }

    if (grabbeerResult.failure.length) {
      await fs.writeFileSync("./failure-report.json", makeJsonFailureReport(grabbeerResult.failure));
    }
    console.log(
      `Successfully got ${grabbeerResult.success.length} drinks. Failure ${grabbeerResult.failure.length}. Saving ...`
    );
    await dbService.upsertDrinks(grabbeerResult.success);
    console.log("Done");

    console.log("Updating ingredients");
    let ings = await dbService.getAllIngredients();
    console.log(ings);
    // fetch ingredient details
    // save in db
  } catch (e) {
    console.log(e);
  }
}

main(false);

const makeJsonFailureReport = errors =>
  JSON.stringify(
    errors.map(x => ({
      status: x.response.status,
      url: x.response.config.url
    }))
  );
