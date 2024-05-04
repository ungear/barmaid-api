import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DbService } from './db/db.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dbService: DbService,
  ) {}

  summaryCache = null;

  @Get()
  async getHello(): Promise<any> {
    const a = await this.dbService.drink.findFirst();
    return a; //this.appService.getHello();
  }

  @Get("/summary")
  @ApiOperation({ summary: 'Number of drinks, ingredients and alc types in DB' })
  async getSummary(): Promise<any> {
    if(this.summaryCache) return this.summaryCache;

    const drinksCount = await this.dbService.drink.count();
    const ingredientsCount = await this.dbService.ingredient.count();

    this.summaryCache = { drinks: drinksCount, ingredients: ingredientsCount};
    return this.summaryCache;
  }
}
