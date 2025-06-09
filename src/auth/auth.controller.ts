import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { AllExceptionsFilter } from 'src/filters/http-exception.filter';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/signin")
  @UseFilters(AllExceptionsFilter)
  signin(@Body() signinData: SigninDto) {
    return this.authService.signinUser(signinData)
  }

  @Post("/signup")
  @UseFilters(AllExceptionsFilter)
  signup(@Body() signinData: SignupDto) {
    return this.authService.signupUser(signinData)
  }
}
