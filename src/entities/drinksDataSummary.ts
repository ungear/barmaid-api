import { ApiProperty } from "@nestjs/swagger";

export class DrinksDataSummary {
  @ApiProperty()
  alcDrinksCount: number;

  @ApiProperty()
  nonAlcDrinksCount: number;

  @ApiProperty()
  optionalAlcDrinksCount: number;

  @ApiProperty()
  ingredients: number;
}
