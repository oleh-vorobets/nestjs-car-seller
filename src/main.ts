import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cookieSession({
  //     keys: ['string that encrypts cookies'],
  //   }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // will delete unneccessary properties
  //   }),
  // );
  await app.listen(3000);
}
bootstrap();
