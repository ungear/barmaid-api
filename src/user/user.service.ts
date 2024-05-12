import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateUserDto } from './dto';
import { PasswordService } from './password.service';

@Injectable()
export class UserService {
  constructor(
    private dbService: DbService, 
    private passwordService: PasswordService) {}

  createUser(userParams: CreateUserDto){
    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(userParams.password, salt);
    return this.dbService.user.create({
      data: {
        login: userParams.login,
        salt,
        hash,
      }
    })
  }

  findByLogin(login: string){
    return this.dbService.user.findFirst({where: { login: login}})
  }
}
