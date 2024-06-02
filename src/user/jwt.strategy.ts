import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { COOKIE_NAME, JWT_SECRET } from './authSettings';
import { JwtPayload } from './dto';
import {Request} from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: authCookieExtractor,
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  // Takes decoded JWT, adds user data to req
  validate(payload: JwtPayload) {
    return { userId: payload.userId };
  }
}

export function authCookieExtractor (request: Request) {
  var token = null;
  if (request && request.cookies) {
    token = request.cookies[COOKIE_NAME];
  }
  return token;
};

