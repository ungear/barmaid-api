import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DbService } from './db/db.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dbService: DbService,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const a = await this.dbService.drink.findFirst();
    return a; //this.appService.getHello();
  }
}
