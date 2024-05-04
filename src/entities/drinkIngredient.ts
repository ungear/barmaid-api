import { ApiProperty } from "@nestjs/swagger";
import { DrinkIngredient } from "@prisma/client";

export class DrinkIngredientEntity implements DrinkIngredient{
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  ingredientId: number;
  
  @ApiProperty()
  drinkId: number;
  
  @ApiProperty()
  measure: string;
}