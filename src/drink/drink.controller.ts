import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DrinkService } from './drink.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('drink')
export class DrinkController {
  constructor(private drinkService: DrinkService) {}

  @Get()
  @ApiOperation({ summary: 'Get all drinks' })
  async getAllDrinks(): Promise<any> {
    return this.drinkService.getAllDrinks();
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search drinks by name' })
  async searchDrinks(@Query('name') name: string): Promise<any> {
    return this.drinkService.getDrinks(name);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a drink by id' })
  async getDrinkById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.drinkService.getDrinkById(id);
  }
}
