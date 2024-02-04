import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { DrinkModule } from './drink/drink.module';

@Module({
  imports: [DbModule, DrinkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
