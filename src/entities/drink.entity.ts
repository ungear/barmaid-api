import { ApiProperty } from "@nestjs/swagger";
import { Drink } from "@prisma/client";
import { DrinkIngredientEntity } from "./drinkIngredient";

export class DrinkEntity implements Drink{
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  name: string;

  @ApiProperty()
  alcTypeId: number;

  @ApiProperty()
  glass: string;

  @ApiProperty()
  instructions: string;

  @ApiProperty()
  thumbImageUrl: string;

  @ApiProperty()
  imageSmall: string;

  @ApiProperty()
  imageMedium: string;
}

export class DrinkWithIngredients implements Drink{
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  name: string;

  @ApiProperty()
  alcTypeId: number;

  @ApiProperty()
  glass: string;

  @ApiProperty()
  instructions: string;

  @ApiProperty()
  thumbImageUrl: string;

  @ApiProperty({ type: [DrinkIngredientEntity] })
  ingredients: DrinkIngredientEntity[];

  @ApiProperty()
  imageSmall: string;

  @ApiProperty()
  imageMedium: string;
}