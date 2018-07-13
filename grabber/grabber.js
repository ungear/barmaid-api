const axios = require("axios")

const TARGET_API_BASE_URL = "https://www.thecocktaildb.com/api/json/v1";
const API_KEY = 1;
const TARGET_URLS = {
  getAllAlcoholic: [TARGET_API_BASE_URL, API_KEY, "filter.php?a=Alcoholic"].join("/"),
  getAllNonAlcoholic: [TARGET_API_BASE_URL, API_KEY, "filter.php?a=Non_Alcoholic"].join("/"),
  getAllOptionalAlcoholic: [TARGET_API_BASE_URL, API_KEY, "filter.php?a=Optional_alcohol"].join("/"),
} 

exports.getAllDrinks = function(){
  return Promise.all([
    axios.get(TARGET_URLS.getAllAlcoholic),
    axios.get(TARGET_URLS.getAllNonAlcoholic),
    axios.get(TARGET_URLS.getAllOptionalAlcoholic),
  ])
  .then(d => [...d[0].data.drinks, ...d[1].data.drinks, ...d[2].data.drinks])
}