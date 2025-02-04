import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUser: LoginUserDto ) {
    return this.authService.login(loginUser);
  }

  @Get('check-status')
  @Auth()
  async checkAuthStatus(
    @GetUser() user: User
  ) {

    return await this.authService.checkAuthStatus( user );
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    // @Req() request: Express.Request
    @RawHeaders() rawHeaders: IncomingHttpHeaders
  ) {


    return {
      ok: true,
      message: 'Hola Mundo',
      user,
      userEmail,
      rawHeaders
    };
  }


  @Get('private2')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {


    return {
      ok: true,
      user,
    }

  }



  @Get('private3')
  @Auth(  ValidRoles.admin  )
  privateRoute3(
    @GetUser() user: User
  ) {


    return {
      ok: true,
      user,
    }

  }



}
