import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { envs } from 'src/config/envs';
import { Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {


    constructor(

        @InjectRepository( User ) private readonly userRepository: Repository<User>

    ) {
        super({
            secretOrKey: envs.secretJwt,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate( payload: JwtPayload): Promise<User> {
        

        const { id } = payload;

        const user = await this.userRepository.findOneBy({id});

        if ( !user ) {
            throw new UnauthorizedException('Token no válido');
        }

        if ( !user.isActive ) {
            throw new UnauthorizedException('Usuario no activo');
        }

        return user ;  // se añade a la request.
    }

}