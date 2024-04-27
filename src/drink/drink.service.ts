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
}
