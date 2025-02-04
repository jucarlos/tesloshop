import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../config/envs';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  imports: [

    TypeOrmModule.forFeature([
      User
    ]),

    PassportModule.register({
      defaultStrategy: 'jwt'
    }),

    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {

        return {
          secret: envs.secretJwt,
          signOptions: {
            expiresIn: '6h'
          }
        };
      }
    }),

  ], 
  exports: [JwtStrategy, TypeOrmModule, PassportModule, JwtModule ]
})


export class AuthModule { }
