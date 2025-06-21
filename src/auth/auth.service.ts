import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { hashPassword } from 'src/utils/hash-password.utils.';
import { comparePassword } from 'src/utils/compare-password.utils';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) { }

  async signinUser(signinData: SigninDto, res: Response) {
    const { email, password } = signinData;

    if (!email || !password) throw new BadRequestException('All fields are required.');
    const user = await this.databaseService.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) throw new UnauthorizedException('Email is incorrect.');

    const isMatch = await comparePassword(password, user.password as string);

    if (!isMatch) throw new UnauthorizedException('Password is incorrect.');

    const payload = { sub: user.id, name: user.name, role: user.role } // get and assign the user id, name and role to the payload object

    const accessToken = await this.jwtService.signAsync(payload); // use signAsync function to asynchronously create a jwt. We takes javascript object contains user info (e.g. id and role) and encodes it in jwt payload
    console.log("accessToken: ", accessToken);

    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: true,
    });

    return { success: true, message: "login successfully", accessToken };
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
