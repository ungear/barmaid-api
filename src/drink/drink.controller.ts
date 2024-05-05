import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DrinkService } from './drink.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { DrinkWithIngredients } from '../entities/drink.entity';

@Controller('drink')
export class DrinkController {
  constructor(private drinkService: DrinkService) {}

  @Get()
  @ApiOperation({ summary: 'Get all drinks' })
  @ApiOkResponse({ type: [DrinkWithIngredients] })
  async getAllDrinks(): Promise<any> {
    return this.drinkService.getAllDrinks();
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search drinks by name' })
  @ApiOkResponse({ type: [DrinkWithIngredients] })
  async searchDrinks(@Query('name') name: string): Promise<any> {
    return this.drinkService.getDrinks(name);
  }

  @Get('/search-by-ingredients')
  @ApiOperation({ summary: 'Search drinks containing ALL the ingredients in the provided list' })
  @ApiOkResponse({ type: [DrinkWithIngredients] })
  async searchDrinksByIngredients(
    @Query('ings') ingredients: string,
  ): Promise<any> {
    const ingIds = ingredients.split(',').map(Number);
    return this.drinkService.getDrinksByIngredients(ingIds);
  }

  @Get('/random')
  @ApiOperation({ summary: 'Get `count` ramdon drinks' })
  @ApiOkResponse({ type: [DrinkWithIngredients] })
  async getRandomDrinks(@Query('count', ParseIntPipe) count: number): Promise<any> {
    return this.drinkService.getRandomDrinks(count);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a drink by id' })
  @ApiOkResponse({ type: DrinkWithIngredients })
  async getDrinkById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.drinkService.getDrinkById(id);
  }
}
