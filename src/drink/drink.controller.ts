import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DrinkService } from './drink.service';

@Controller('drink')
export class DrinkController {
  constructor(private drinkService: DrinkService) {}

  @Get()
  async getAllDrinks(): Promise<any> {
    return this.drinkService.getAllDrinks();
  }

  @Get('/search')
  async searchDrinks(@Query('name') name: string): Promise<any> {
    return this.drinkService.getDrinks(name);
  }

  @Get('/:id')
  async getDrinkById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.drinkService.getDrinkById(id);
  }
}
