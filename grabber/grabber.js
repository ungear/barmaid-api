const axios = require("axios");

const TARGET_API_BASE_URL = "https://www.thecocktaildb.com/api/json/v1";

const API_KEY = 1;
// prettier-ignore
const TARGET_URLS = {
  getAllAlcoholic: [TARGET_API_BASE_URL, API_KEY, "filter.php?a=Alcoholic"].join("/"),
  getAllNonAlcoholic: [TARGET_API_BASE_URL, API_KEY, "filter.php?a=Non_Alcoholic"].join("/"),
  getAllOptionalAlcoholic: [TARGET_API_BASE_URL, API_KEY, "filter.php?a=Optional_alcohol"].join("/"),
  getDrinkById: (id) => `${TARGET_API_BASE_URL}/${API_KEY}/lookup.php?i=${id}`,
}

exports.getAllDrinks = function() {
  return Promise.all([
    axios.get(TARGET_URLS.getAllAlcoholic),
    axios.get(TARGET_URLS.getAllNonAlcoholic),
    axios.get(TARGET_URLS.getAllOptionalAlcoholic)
  ]).then(d => [...d[0].data.drinks, ...d[1].data.drinks, ...d[2].data.drinks]);
};

exports.getAllDrinksFullData = async function() {
  let allDrinkIds = await getAllDrinkIds();
  let loader = asyncDrinkGenerator(allDrinkIds);
  let allDrinks = [];
  for await (let drinkData of loader) {
    allDrinks.push(drinkData);
  }
  return allDrinks;
};

function getAllDrinkIds() {
  return Promise.all([
    axios.get(TARGET_URLS.getAllAlcoholic),
    axios.get(TARGET_URLS.getAllNonAlcoholic),
    axios.get(TARGET_URLS.getAllOptionalAlcoholic)
  ]).then(d =>
    [...d[0].data.drinks, ...d[1].data.drinks, ...d[2].data.drinks].map(
      x => x.idDrink
    )
  );
}

async function* asyncDrinkGenerator(ids) {
  while (ids.length) {
    let drinkUrl = TARGET_URLS.getDrinkById(ids.pop());
    yield await axios.get(drinkUrl).then(response => response.data.drinks[0]);
  }
}
