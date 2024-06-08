import { Controller, Post, Body, UnauthorizedException, Res } from '@nestjs/common';
import {Response} from "express";
import { CreateUserResponseDto, JwtPayload, LoginDto } from './dto';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { COOKIE_DOMAIN, COOKIE_MAX_AGE_MS, COOKIE_NAME } from './authSettings';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({type: CreateUserResponseDto})
  async login(
    @Body() params: LoginDto, 
    @Res({ passthrough: true }) response: Response
  ) : Promise<CreateUserResponseDto> {
    const user = await this.authService.validateUser(params.login, params.password);
    if(!user) throw new UnauthorizedException();
    

    const payload: JwtPayload = { userId: user.id };
    const signedJwt = await this.jwtService.signAsync(payload);

    response.cookie(COOKIE_NAME, signedJwt, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE_MS, 
      domain: COOKIE_DOMAIN,
      sameSite: "none",
      secure: true,
    });

    return {id: user.id, login: user.login};
  }
}
