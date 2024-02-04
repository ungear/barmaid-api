import { Controller, Get } from '@nestjs/common';
import { IngredientService } from './ingredient.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Get()
  async getAllIngredients(): Promise<any> {
    return this.ingredientService.getAllIngredients();
  }
}
