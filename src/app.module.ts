import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

const JWT_SECRET = process.env.JWT_SECRET;

@Module({
  imports: [UserModule, DatabaseModule, AuthModule, JwtModule.register({
    global: true,   // global: true: We set it to true and it will be available app-wide.
    secret: JWT_SECRET,
    signOptions: { expiresIn: '1h' }
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


// Normally we configure the JWT (e.g. secret: JWT_SECRET or expiresIn: '1h') when we create the jwt like this "jwtService.signAsync(payload, { secret: JWT_SECRET, etc.})" in the service but it is not recommended or not suit for best practices because if 
// we call the "jwtService.signAsync(payload)" anywhere we will configuring again the JWT, So in order to avoid this we set the JWT configuration here in the root/core module or app module so that we can just call "jwtService.signAsync(payload)" anywhere without needing to configure it.
// JWT consist of three parts (Header, Payload, Signature)