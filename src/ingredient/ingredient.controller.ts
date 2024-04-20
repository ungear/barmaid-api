import { Controller, Get } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ingredients' })
  async getAllIngredients(): Promise<any> {
    return this.ingredientService.getAllIngredients();
  }
}
