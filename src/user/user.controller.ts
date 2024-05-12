import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto, CreateUserResponseDto } from './dto';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({type: CreateUserResponseDto})
  async login(@Body() params: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.userService.createUser(params);
    return {id: user.id, login: user.login};
  }
}
