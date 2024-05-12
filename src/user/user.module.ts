import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { DbModule } from 'src/db/db.module';
import { UserService } from './user.service';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController, UserController],
  imports: [DbModule],
  providers: [UserService, PasswordService, AuthService],
})
export class UserModule {}
