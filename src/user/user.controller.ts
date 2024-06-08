import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto, CreateUserResponseDto } from './dto';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('current')
  @ApiOperation({ summary: 'Get the current user info' })
  @ApiOkResponse({type: CreateUserResponseDto})
  async getCurrentUser(@Request() req): Promise<CreateUserResponseDto> {
    const user = await this.userService.findById(req.user.userId);
    return {id: user.id, login: user.login};
  }

  // TODO: remove the /protected endpoint
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  @ApiOperation({ summary: 'The endpoint to test authentication' })
  getProfile(@Request() req) {
    return req.user;
  }
}
