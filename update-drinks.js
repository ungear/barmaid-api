const grabber = require("./grabber/grabber.js");
const dbService = require("./db/dbService.js");
const ObjectID = require("mongodb").ObjectID;
const fs = require("fs");

async function main(getDataFromJson) {
  try {
    let sourceData = getDataFromJson ? require("./complete-source-data.json") : await fetchSourceData();
    await dbService.populateDb(sourceData);
  } catch (e) {
    console.log(e);
  }
}

main(true);

const makeJsonFailureReport = errors =>
  JSON.stringify(
    errors.map(x => ({
      status: x.response.status,
      url: x.response.config.url
    }))
  );

async function fetchSourceData() {
  let grabbeerResult = await grabber.getAllDrinksFullData();
  if (grabbeerResult.failure.length) {
    console.log("Failed to load some drinks source data. See report.");
    await fs.writeFileSync("./failure-report.json", makeJsonFailureReport(grabbeerResult.failure));
  }

  let d = extractFromSourceDrinksData(grabbeerResult.success);
  for (let ing of d.ingredients) {
    console.log("getting " + ing.ingredientName);
    let ingDetails = await grabber
      .getIngredientDetailsByName(ing.ingredientName)
      .catch(e => ({ strDescription: null, strType: null }));
    ing.description = ingDetails.strDescription;
    ing.type = ingDetails.strType;
  }
  await fs.writeFileSync("./complete-source-data.json", JSON.stringify(sourceData));

  return d;
}

function extractFromSourceDrinksData(sourceDrinks) {
  let result = { drinks: [], ingredients: [] };

  for (let sourceDrink of sourceDrinks) {
    let dbDrinkIngredients = [];
    for (let index = 1; index <= 15; index++) {
      let sourceDrinkIngName = sourceDrink["strIngredient" + index];
      if (sourceDrinkIngName) {
        let existingInredient = result.ingredients.find(x => x.ingredientName === sourceDrinkIngName);
        let existingInredientId;
        if (existingInredient) {
          existingInredientId = existingInredient._id;
        } else {
          let newIng = {
            ingredientName: sourceDrinkIngName,
            _id: new ObjectID()
          };
          result.ingredients.push(newIng);
          existingInredientId = newIng._id;
        }
        dbDrinkIngredients.push({
          ingId: existingInredientId,
          measure: sourceDrink["strMeasure" + index]
        });
      }
    }
    result.drinks.push({
      name: sourceDrink.strDrink,
      _id: new ObjectID(),
      thumbImageUrl: sourceDrink.strDrinkThumb,
      alcType: sourceDrink.strAlcoholic,
      glass: sourceDrink.strGlass,
      instructions: sourceDrink.strInstructions,
      ingredients: dbDrinkIngredients
    });
  }
  return result;
}
