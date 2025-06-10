import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/signin")
  // @UseFilters(AllExceptionsFilter) this is how we implement an exception filter in a specific route
  signin(@Body() signinData: SigninDto) {
    return this.authService.signinUser(signinData)
  }

  @Post("/signup")
  signup(@Body() signinData: SignupDto) {
    return this.authService.signupUser(signinData)
  }
}
