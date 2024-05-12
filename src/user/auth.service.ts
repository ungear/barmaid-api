import { Injectable } from '@nestjs/common';
import { PasswordService } from './password.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private userService: UserService,
  ) {}

    // Returns userId if creds are corect. Returns null otherwise
    async validateUser(login: string, pass: string): Promise<number> {
      const user = await this.userService.findByLogin(login);
      if (!user) return null;
  
      const hash = this.passwordService.getHash(pass, user.salt);
      if (user.hash === hash) {
        return user.id;
      }
      return null;
    }
}
