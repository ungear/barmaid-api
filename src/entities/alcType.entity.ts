import { ApiProperty } from "@nestjs/swagger";
import { AlcType } from "@prisma/client";

export class AlcTypeEntity implements AlcType{
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  name: string;
}
