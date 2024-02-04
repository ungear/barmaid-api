import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class IngredientService {
  constructor(private dbService: DbService) {}

  getAllIngredients() {
    return this.dbService.ingredient.findMany();
  }
}
