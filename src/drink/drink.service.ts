import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class DrinkService {
  constructor(private dbService: DbService) {}

  getAllDrinks() {
    return this.dbService.drink.findMany({
      include: {
        ingredients: true,
      },
    });
  }

  getDrinkById(id: number) {
    return this.dbService.drink.findUnique({
      where: {
        id,
      },
      include: {
        ingredients: true,
      },
    });
  }

  getDrinks(name: string) {
    return this.dbService.drink.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        ingredients: true,
      },
    });
  }

  /**returns a list of grinks, each drinks contains all of the ingredients */
  async getDrinksByIngredients(queryIngIds: number[]) {
    const result = await this.dbService.drinkIngredient.findMany({
      where: {
        ingredientId: { in: queryIngIds },
      },
      select: {
        drinkId: true,
      },
    });
    const drinkIds = result.map(x => x.drinkId);

    // list of grinks containing at least ONE of the ingredients
    const drinksOr = await this.dbService.drink.findMany({
      where: {
        id: { in: drinkIds },
      },
      include: {
        ingredients: true,
      },
    });

    // ist of grinks, each contains ALL of the ingredients
    const drinksAnd = drinksOr.filter(dr => {
      const drinkIngIds = dr.ingredients.map(di => di.ingredientId);
      const nonMatchingIngredients = queryIngIds.filter(qd => !drinkIngIds.includes(qd));
      return nonMatchingIngredients.length === 0;
    })
    return drinksAnd;
  }
}
