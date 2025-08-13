import { Module } from '@nestjs/common';
import { User, UserSchema } from './entities/user.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Session, SessionSchema } from './entities/session.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ExceptionHandler } from 'src/utils/exceptionHandler';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  providers: [AuthService, ExceptionHandler],
  controllers: [AuthController],
})
export class AuthModule { }