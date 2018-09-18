const Koa = require("koa");
const Router = require("koa-router");
const mongoose = require("mongoose");
const dbUrl = require("../db/dbConfig.js").DB_URL;
const Drink = require("../db/models/drink.model").Drink;
const Ingredient = require("../db/models/ingredient.model").Ingredient;

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true }
);

const app = new Koa();
const router = new Router();

router.get("/drinks", async function(ctx) {
  ctx.body = await Drink.find({});
});

router.get("/ingredients", async function(ctx) {
  ctx.body = await Ingredient.find({});
});

router.get("/", async function(ctx) {
  ctx.body = { message: "Hello World!" };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3009);