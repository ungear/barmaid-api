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
}

// get drinks short data {id, name, thumbURL}
exports.getAllDrinks = function() {
  return Promise.all([
    axios.get(TARGET_URLS.getAllAlcoholic),
    axios.get(TARGET_URLS.getAllNonAlcoholic),
    axios.get(TARGET_URLS.getAllOptionalAlcoholic)
  ]).then(d => [...d[0].data.drinks, ...d[1].data.drinks, ...d[2].data.drinks]);
};

exports.getAllDrinksFullData = async function() {
  let allDrinkIdsResult = await getAllDrinkIds();
  if (!allDrinkIdsResult.success) {
    return { success: false, error: allDrinkIdsResult.error };
  }
  console.log(`Grabber: got drinkIds ${allDrinkIdsResult.ids.length}`);
  let loader = asyncDrinkGenerator(allDrinkIdsResult.ids);
  let result = {
    success: [],
    failure: []
  };
  for await (let x of loader) {
    if (x.success) result.success.push(x.data);
    else result.failure.push(x.error);
  }
  return { success: true, data: result };
};

exports.getAllIngredients = function() {
  return axios.get(TARGET_URLS.getAllIngredients).then(resp => resp.data.drinks);
};

function getAllDrinkIds() {
  return Promise.all([
    axios.get(TARGET_URLS.getAllAlcoholic),
    axios.get(TARGET_URLS.getAllNonAlcoholic),
    axios.get(TARGET_URLS.getAllOptionalAlcoholic)
  ])
    .then(d => ({
      success: true,
      ids: [...d[0].data.drinks, ...d[1].data.drinks, ...d[2].data.drinks].map(x => x.idDrink)
    }))
    .catch(e => ({
      success: false,
      error: e
    }));
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
