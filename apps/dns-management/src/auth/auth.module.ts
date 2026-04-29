import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ModelModule } from '../model/model.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ModelModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
