const grabber = require("./grabber/grabber.js");
const dbService = require("./db/dbService.js");
const fs = require("fs");

async function main() {
  console.log("Getting drinks source data...");
  try {
    let grabbeerResult = await grabber.getAllDrinksFullData();
    if (grabbeerResult.failure) {
      await fs.writeFileSync("./failure-report.json", makeJsonFailureReport(grabbeerResult.failure));
    }
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

const makeJsonFailureReport = errors =>
  JSON.stringify(
    errors.map(x => ({
      status: x.response.status,
      url: x.response.config.url
    }))
  );
