import { Controller, Get } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { IngredientEntity } from 'src/entities/ingredient.entity';

@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiOkResponse({ type: [IngredientEntity] })
  async getAllIngredients(): Promise<any> {
    return this.ingredientService.getAllIngredients();
  }
}
