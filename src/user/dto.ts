import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;
}

export class CreateUserResponseDto{
  @ApiProperty()
  login: string;

  @ApiProperty()
  id: number;
}

export class LoginDto{
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;
}

export class JwtPayload {
  userId: number;
}