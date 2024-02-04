import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DrinkService } from './drink.service';

@Controller('drink')
export class DrinkController {
  constructor(private drinkService: DrinkService) {}

  @Get()
  async getAllDrinks(): Promise<any> {
    return this.drinkService.getAllDrinks();
  }

  @Get(':id')
  async getDrinkById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.drinkService.getDrinkById(Number(id));
  }
}
