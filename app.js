const grabber = require("./grabber/grabber.js")
const dbService = require("./db/dbService.js");

dbService.getDrinkNames().then(data => 
  console.log(data)
)