const axios = require("axios");

const TARGET_API_BASE_URL = "https://www.thecocktaildb.com/api/json/v1";

const API_KEY = 1;
// prettier-ignore
const TARGET_URLS = {
  getAllAlcoholic: [TARGET_API_BASE_URL, API_KEY, "filter.php?a=Alcoholic"].join("/"),
  getAllNonAlcoholic: [TARGET_API_BASE_URL, API_KEY, "filter.php?a=Non_Alcoholic"].join("/"),
  getAllOptionalAlcoholic: [TARGET_API_BASE_URL, API_KEY, "filter.php?a=Optional_alcohol"].join("/"),
  getDrinkById: (id) => `${TARGET_API_BASE_URL}/${API_KEY}/lookup.php?i=${id}`,
  getAllIngredients: [TARGET_API_BASE_URL, API_KEY, "list.php?i=list"].join("/"),
  getIngredientByName: (name) => `${TARGET_API_BASE_URL}/${API_KEY}/search.php?i=${name}`,
}

// get drinks short data {id, name, thumbURL}
export function getAllDrinks(): Promise<SourceDrinkModel[]> {
  return Promise.all([
    axios.get(TARGET_URLS.getAllAlcoholic),
    axios.get(TARGET_URLS.getAllNonAlcoholic),
    axios.get(TARGET_URLS.getAllOptionalAlcoholic)
  ]).then(d => [...d[0].data.drinks, ...d[1].data.drinks, ...d[2].data.drinks]);
}

export async function getAllDrinksFullData(): Promise<DrinksGrabberResult> {
  try {
    let allDrinkIds = await getAllDrinkIds().catch(e => {
      let error = new Error("failed to load drinkIds") as any;
      error.url = e.response.config.url;
      error.status = e.response.status;
      throw error;
    });
    console.log(`Grabber: got drinkIds ${allDrinkIds.length}`);
    let loader = asyncDrinkGenerator(allDrinkIds);
    let result = {
      success: [],
      failure: []
    };
    for await (let x of loader) {
      if (x.success) result.success.push(x.data);
      else result.failure.push(x.error);
    }
    return result;
  } catch (e) {
    throw e;
  }
}

export function getAllIngredients() {
  return axios.get(TARGET_URLS.getAllIngredients).then(resp => resp.data.drinks);
}

export function getIngredientDetailsByName(name) {
  return axios.get(TARGET_URLS.getIngredientByName(name)).then(resp => resp.data.ingredients[0]);
}

function getAllDrinkIds() {
  return Promise.all([
    axios.get(TARGET_URLS.getAllAlcoholic),
    axios.get(TARGET_URLS.getAllNonAlcoholic),
    axios.get(TARGET_URLS.getAllOptionalAlcoholic)
  ]).then(d => [...d[0].data.drinks, ...d[1].data.drinks, ...d[2].data.drinks].map(x => x.idDrink));
}

async function* asyncDrinkGenerator(ids) {
  while (ids.length) {
    let drinkUrl = TARGET_URLS.getDrinkById(ids.pop());
    yield await axios
      .get(drinkUrl)
      .then(response => {
        console.log("OK " + drinkUrl);
        return { success: true, data: response.data.drinks[0] };
      })
      .catch(e => {
        console.log("FAIL " + drinkUrl);
        return { success: false, error: e };
      });
  }
}
