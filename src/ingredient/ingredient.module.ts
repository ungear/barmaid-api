import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [IngredientService],
  controllers: [IngredientController],
  imports: [DbModule],
})
export class IngredientModule {}
