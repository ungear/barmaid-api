const Koa = require("koa");
const Router = require("koa-router");
const mongoose = require("mongoose");
const dbUrl = require("../config").DB_URL;
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
  ctx.body = await Drink.find({ name: new RegExp(like, "i") }).sort({ name: 1 });
});

// drinks/by-ingredients?ingIds=id1;id2;id3 ...
router.get("/drinks/by-ingredients", async function(ctx) {
  let ingIds = ctx.request.query.ingIds.split(";").map(x => mongoose.Types.ObjectId(x));
  let ingredienConditions = ingIds.map(ingId => ({
    "ingredients.ingId": ingId
  }));

  ctx.body = await Drink.find()
    .and(ingredienConditions)
    .sort({ name: 1 })
    .exec();
});

router.get("/drinks/:id", async function(ctx) {
  ctx.body = await Drink.find({ id: ctx.params.id });
});

router.get("/drinks/full/:id", async function(ctx) {
  let drink = await Drink.findById(ctx.params.id).then(x => x.toJSON());
  let ingIds = drink.ingredients.map(x => x.ingId);
  let ingredients = await Ingredient.find({ _id: { $in: ingIds } });
  drink.ingredients.forEach(ing => {
    let linkedIngDetailed = ingredients.find(x => x._id.toJSON() === ing.ingId.toJSON());
    ing.description = linkedIngDetailed ? linkedIngDetailed.description : null;
    ing.name = linkedIngDetailed ? linkedIngDetailed.ingredientName : null;
  });
  // Get a drink and all linked ingredients
  // Drawback - we have to pass the collection name ("ingredients" in code below), but we dont know it on this level
  // let f = await Drink.aggregate([
  //   {
  //     $match: {
  //       _id: ObjectID(ctx.params.id)
  //     }
  //   },
  //   {
  //     $lookup: {
  //       from: "ingredients",
  //       localField: "ingredients.ingId",
  //       foreignField: "_id",
  //       as: "ingredientsData"
  //     }
  //   }
  // ]);

  ctx.body = drink;
});

router.get("/drinks", async function(ctx) {
  ctx.body = await Drink.find({}).sort({ name: 1 });
});

router.get("/ingredients/:id", async function(ctx) {
  ctx.body = await Ingredient.findById(ctx.params.id);
});
router.get("/ingredients", async function(ctx) {
  ctx.body = await Ingredient.find({}).sort({ ingredientName: 1 });
});

router.get("/", async function(ctx) {
  ctx.body = router.stack.map(x => x.path);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3009);
