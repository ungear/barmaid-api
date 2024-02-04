import { PrismaClient } from '@prisma/client';
import * as DrinksSource from './drinks-db.json';
import * as IngredientSource from './ingredients-db.json';

const prismaClient = new PrismaClient();
main();

async function main() {
  // Ingredients
  // for (const ing of IngredientSource) {
  //   console.log('creating ' + ing.name);
  //   const a = await prismaClient.ingredient.create({
  //     data: {
  //       Name: ing.name,
  //     },
  //   });
  //   console.log(a);
  // }
  // Alc Types
  // const alcTypes = new Set<string>();
  // for (const sourceDrink of DrinksSource) {
  //   alcTypes.add(sourceDrink.alcType);
  // }
  // for (const alcType of alcTypes) {
  //   console.log('creating alc type ' + alcType);
  //   const dbAlcType = await prismaClient.alcType.create({
  //     data: {
  //       Name: alcType,
  //     },
  //   });
  //   console.log(dbAlcType);
  // }
  // Drinks
  const alcTypesDb = await prismaClient.alcType.findMany({
    select: { Name: true, Id: true },
  });
  const ingredientsDb = await prismaClient.ingredient.findMany({
    select: { Name: true, Id: true },
  });
  // console.log(alcTypesDb);
  // console.log(ingredientsDb);
  for (const sourceDrink of DrinksSource) {
    console.log('creating ' + sourceDrink.name);
    const alctypeId = alcTypesDb.find((x) => x.Name === sourceDrink.alcType);
    const dbDrink = await prismaClient.drink.create({
      data: {
        Name: sourceDrink.name,
        AlcType: {
          connect: { Id: alctypeId.Id },
        },
        Glass: sourceDrink.glass,
        Instructions: sourceDrink.instructions,
        ThumbImageUrl: sourceDrink.thumbImageUrl,
      },
    });

    for (const dIng of sourceDrink.ingredients) {
      const sourceIngName = IngredientSource.find(
        (x) => x.id === dIng.ingId,
      ).name;
      const dbIngId = ingredientsDb.find((x) => x.Name === sourceIngName).Id;
      await prismaClient.drinkIngredient.create({
        data: {
          Measure: dIng.measure,
          Drink: {
            connect: { Id: dbDrink.Id },
          },
          Ingredient: {
            connect: { Id: dbIngId },
          },
        },
      });
    }

    console.log(dbDrink);
  }
}
