const grabber = require("./grabber/grabber.js");
const dbService = require("./db/dbService.js");

grabber.getAllDrinksFullData().then(data => dbService.upsertDrinks(data));
