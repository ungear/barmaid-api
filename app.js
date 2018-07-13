const grabber = require("./grabber/grabber.js")

grabber.getAllDrinks().then(x => console.log(x.length))