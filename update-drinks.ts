import * as grabber from "./grabber/grabber";
import * as dbService from "./db/dbService.js";
import { ObjectID } from "mongodb";
import * as fs from "fs";
import { SOURCE_DATA_PATH } from "./config.js";
const SOURCE_DATA = require(SOURCE_DATA_PATH).default;

async function main() {
  try {
    let dataSet = await fetchSourceData();
    await dbService.dropDb();
    await dbService.populateDb(dataSet);
  } catch (e) {
    console.log(e);
  }
}

main();

async function fetchSourceData() {
  let d = extractFromSourceDrinksData(SOURCE_DATA);
  for (let ing of d.ingredients) {
    console.log("getting " + ing.ingredientName);
    let ingDetails = await grabber
      .getIngredientDetailsByName(ing.ingredientName)
      .catch(e => ({ strDescription: null, strType: null }));
    ing.description = ingDetails.strDescription;
    ing.type = ingDetails.strType;
  }
  return d;
}

function extractFromSourceDrinksData(sourceDrinks) {
  let result = { drinks: [], ingredients: [] };

  for (let sourceDrink of sourceDrinks) {
    let dbDrinkIngredients = [];
    for (let index = 1; index <= 15; index++) {
      let sourceDrinkIngName = sourceDrink["strIngredient" + index];
      if (sourceDrinkIngName) {
        let existingInredient = result.ingredients.find(x => x.ingredientName === sourceDrinkIngName.toLowerCase());
        let existingInredientId;
        if (existingInredient) {
          existingInredientId = existingInredient._id;
        } else {
          let newIng = {
            ingredientName: sourceDrinkIngName.toLowerCase(),
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
