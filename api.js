const express = require('express');
const dbService = require('./db/dbService.js');
const app = express()

// /api/getnames?like=test
app.get('/api/getnames', async function (req, res) {
  let data = await dbService.getDrinkNames({like: req.query.like});
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(JSON.stringify(data))
})

const port = 3009;
app.listen(port, () =>{ console.log("Started at port " + port)})