import { Module } from '@nestjs/common';
import { DrinkService } from './drink.service';
import { DrinkController } from './drink.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [DrinkService],
  exports: [DrinkService],
  controllers: [DrinkController],
  imports: [DbModule],
})
export class DrinkModule {}
