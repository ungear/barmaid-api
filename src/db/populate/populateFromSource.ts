import { PrismaClient } from '@prisma/client';
import * as DrinksSource from './drinks-db.json';
import * as IngredientSource from './ingredients-db.json';

const prismaClient = new PrismaClient();

const skipIngredients = true;
main();

async function main() {
  if (!skipIngredients) {
    // Ingredients
    for (const ing of IngredientSource) {
      console.log('creating ' + ing.name);
      const a = await prismaClient.ingredient.create({
        data: {
          name: ing.name,
        },
      });
      console.log(a);
    }

    // Alc Types
    const alcTypes = new Set<string>();
    for (const sourceDrink of DrinksSource) {
      alcTypes.add(sourceDrink.alcType);
    }
    for (const alcType of alcTypes) {
      console.log('creating alc type ' + alcType);
      const dbAlcType = await prismaClient.alcType.create({
        data: {
          name: alcType,
        },
      });
      console.log(dbAlcType);
    }
  }

  // Drinks
  const alcTypesDb = await prismaClient.alcType.findMany({
    select: { name: true, id: true },
  });
  const ingredientsDb = await prismaClient.ingredient.findMany({
    select: { name: true, id: true },
  });

  for (const sourceDrink of DrinksSource) {
    console.log('creating ' + sourceDrink.name);
    const alctypeId = alcTypesDb.find((x) => x.name === sourceDrink.alcType);
    const dbDrink = await prismaClient.drink.create({
      data: {
        name: sourceDrink.name,
        alcType: {
          connect: { id: alctypeId.id },
        },
        glass: sourceDrink.glass,
        instructions: sourceDrink.instructions,
        thumbImageUrl: sourceDrink.thumbImageUrl,
      },
    });

    const drinkIngredientsToCreate = sourceDrink.ingredients.map((dIng) => {
      const sourceIngName = IngredientSource.find(
        (x) => x.id === dIng.ingId,
      ).name;
      const dbIngId = ingredientsDb.find((x) => x.name === sourceIngName).id;
      return {
        measure: dIng.measure,
        drinkId: dbDrink.id,
        ingredientId: dbIngId,
      };
    });
    await prismaClient.drinkIngredient.createMany({
      data: drinkIngredientsToCreate.map((x) => ({
        measure: x.measure,
        drinkId: x.drinkId,
        ingredientId: x.ingredientId,
      })),
    });

    // for (const dIng of sourceDrink.ingredients) {
    //   const sourceIngName = IngredientSource.find(
    //     (x) => x.id === dIng.ingId,
    //   ).name;
    //   const dbIngId = ingredientsDb.find((x) => x.name === sourceIngName).id;
    //   await prismaClient.drinkIngredient.create({
    //     data: {
    //       measure: dIng.measure,
    //       drink: {
    //         connect: { id: dbDrink.id },
    //       },
    //       ingredient: {
    //         connect: { id: dbIngId },
    //       },
    //     },
    //   });
    // }

    console.log(dbDrink);
  }
}
