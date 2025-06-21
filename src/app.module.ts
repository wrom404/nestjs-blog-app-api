import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PostModule } from './post/post.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000,
          limit: 2, // we limit the amount of request here by 2 request withing 1000 milliseconds (1 second)
        },
      ],
    }),
    PostModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard // we apply the throttler globally here to limit the amount of request
    }
  ],
})
export class AppModule { }