import { Body, Controller, Post, Res, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/signin")
  // @UseFilters(AllExceptionsFilter) this is how we implement an exception filter in a specific route
  // { passthrough: true } - Allows NestJS to handle the response lifecycle (e.g., global filters, interceptors) while still giving direct access to the response object for setting cookies.
  signin(@Body() signinData: SigninDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signinUser(signinData, res);
  }

  @Post("/signup")
  signup(@Body() signinData: SignupDto) {
    return this.authService.signupUser(signinData)
  }
}
