import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  @ApiBody({ type: LoginDto })
  async login(@Body() params: LoginDto) {
    const userId = await this.authService.validateUser(params.login, params.password);
    return userId || 'auth failed'
  }
}
