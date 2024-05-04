import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import {ALC_TYPE_IDS} from "../hardcodedIds";

@Injectable()
export class SummaryService {
  constructor(private dbService: DbService) {}

  async getSummary(){
    const groupedDrinks = await this.dbService.drink.groupBy({
      by: ['alcTypeId'],
      _count: { id: true}
    })
    const alcDrinksCount = groupedDrinks.find(x => x.alcTypeId === ALC_TYPE_IDS.alcoholic)._count.id;
    const nonAlcDrinksCount = groupedDrinks.find(x => x.alcTypeId === ALC_TYPE_IDS.nonAlcoholic)._count.id;
    const optionalAlcDrinksCount = groupedDrinks.find(x => x.alcTypeId === ALC_TYPE_IDS.optional)._count.id;

    const ingredientsCount = await this.dbService.ingredient.count();

    return { alcDrinksCount, nonAlcDrinksCount, optionalAlcDrinksCount, ingredients: ingredientsCount};
  }
}