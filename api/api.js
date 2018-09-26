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

// drinks/name?like=beach
router.get("/drinks/by-name", async function(ctx) {
  let like = ctx.request.query.like;
  ctx.body = await Drink.find({ name: new RegExp(like, "i") });
});

// drinks/by-ingredients?ingIds=id1;id2;id3 ...
router.get("/drinks/by-ingredients", async function(ctx) {
  let ingIds = ctx.request.query.ingIds.split(";").map(x => mongoose.Types.ObjectId(x));
  let ingredienConditions = ingIds.map(ingId => ({
    "ingredients.ingId": ingId
  }));

  ctx.body = await Drink.find()
    .and(ingredienConditions)
    .exec();
});

router.get("/drinks/:id", async function(ctx) {
  ctx.body = await Drink.find({ id: ctx.params.id });
});
router.get("/drinks", async function(ctx) {
  ctx.body = await Drink.find({});
});

router.get("/ingredients/:id", async function(ctx) {
  ctx.body = await Ingredient.findById(ctx.params.id);
});
router.get("/ingredients", async function(ctx) {
  ctx.body = await Ingredient.find({});
});

router.get("/", async function(ctx) {
  ctx.body = router.stack.map(x => x.path);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3009);
