import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { hashPassword } from 'src/utils/hash-password.utils.';
import { comparePassword } from 'src/utils/compare-password.utils';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) { }

  async signinUser(signinData: SigninDto) {
    const { email, password } = signinData;

    if (!email || !password) throw new BadRequestException('Email and password are required.');
    const user = await this.databaseService.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) throw new UnauthorizedException('Email is incorrect.');
    const isMatch = await comparePassword(password, user.password as string);
    console.log("isMatch: ", isMatch);
    if (!isMatch) throw new UnauthorizedException('Password is incorrect.');

    return { message: `Login successfully`, user };
  }

  async signupUser(signupDto: SignupDto) {
    const { password, email, name, role } = signupDto;

    if (!email || !password || !name || !role) throw new BadRequestException('All fields are required.');
    const hashedPassword = await hashPassword(password);
    const newUser = await this.databaseService.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
      },
    });

    return newUser;
  }
}
