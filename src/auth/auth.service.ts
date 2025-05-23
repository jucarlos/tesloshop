import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) { }


  async create(createUserDto: CreateUserDto) {


    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken( { id: user.id })
      };

    } catch (error) {
      this.handleDBErrors(error);
    }



  }

  async login(loginUser: LoginUserDto) {

    const { password, email } = loginUser;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, fullName: true, isActive: true, roles: true }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas - email ');
    }

    if ( !bcrypt.compareSync( password, user.password )) {
      throw new UnauthorizedException('Credenciales incorrectas - contraseña ');
    }


    return {
      ...user,
      token: this.getJwtToken( { id: user.id })
    };

  }


  private getJwtToken( payload: JwtPayload ): string {

    const token = this.jwtService.sign( payload );

    return token;

  }

  async checkAuthStatus( user: User ) {

    return {
      ...user,
      token: this.getJwtToken( { id: user.id })
    };
    
  }



  private handleDBErrors(error: any): never {

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Error al crear usuario. Pruebe en unos momentos.');
  }

}
