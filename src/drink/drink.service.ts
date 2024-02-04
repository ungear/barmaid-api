import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class DrinkService {
  constructor(private dbService: DbService) {}

  getAllDrinks() {
    return this.dbService.drink.findMany();
  }

  getDrinkById(id: number) {
    return this.dbService.drink.findUnique({
      where: {
        Id: id,
      },
    });
  }
}
