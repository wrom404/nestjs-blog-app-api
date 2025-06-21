import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter()); // apply global filter exception error
  await app.listen(process.env.PORT ?? 4000);
}

bootstrap().catch((err) => {
  console.log(err);
});
