import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { DrinkEntity } from 'src/entities/drink.entity';

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

  async getRandomDrinks(number: number){
    // The right way would be executing something like this to get the random rows using MySql feature. 
    //    const sql = Prisma.sql`SELECT * FROM barmaid.Drink
    //    ORDER BY RAND()
    //    LIMIT 5`
    // But Prisma is currently not supporting such queries. So, below is a makeshift random picking.


    const drinksCount = await this.dbService.drink.count();
    const skip = randomNumber(0, drinksCount - number);
    const columns: Array<keyof DrinkEntity> = ['name', 'glass', 'instructions', 'thumbImageUrl', 'alcTypeId', 'id'];
    const randomColumnIndex = Math.floor(Math.random() * columns.length);
    const randomOrderField = columns[randomColumnIndex];
    return this.dbService.drink.findMany({
      take: number,
      skip,
      include: {
        ingredients: true,
      },
      orderBy: { [randomOrderField] : 'asc'}
    });
  }
}

function randomNumber(min: number, max: number){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}