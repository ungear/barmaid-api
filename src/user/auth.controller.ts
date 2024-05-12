import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  @ApiBody({ type: LoginDto })
  async login(@Body() params: LoginDto) {
    const user = await this.authService.validateUser(params.login, params.password);
    if(!user) return 'auth failed';
    

    const payload = { sub: user.id };
    const resp = {
      access_token: await this.jwtService.signAsync(payload),
    };
    return resp;

  }
}
