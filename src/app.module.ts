import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { DrinkModule } from './drink/drink.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { AlcTypeModule } from './alcType/alcType.module';
import {SummaryModule} from './summary/summary.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DbModule, DrinkModule, IngredientModule, AlcTypeModule, SummaryModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
