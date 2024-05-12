import { Injectable } from '@nestjs/common';
import { PasswordService } from './password.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private userService: UserService,
  ) {}

    async validateUser(login: string, pass: string) {
      const user = await this.userService.findByLogin(login);
      if (!user) return null;
  
      const hash = this.passwordService.getHash(pass, user.salt);
      if (user.hash === hash) {
        return user;
      }
      return null;
    }
}
