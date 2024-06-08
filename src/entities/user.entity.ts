import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class UserEntity implements User{
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  login: string;
  
  @ApiProperty()
  hash: string;
  
  @ApiProperty()
  salt: string;
}