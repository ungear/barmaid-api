const grabber = require("./grabber/grabber.js")
const dbService = require("./db/dbService.js");

grabber.getAllDrinks().then(data => 
  dbService.upsertDrinks(data)
)