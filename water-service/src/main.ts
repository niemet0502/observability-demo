import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { otelSDK } from './tracer';

async function bootstrap() {
  await otelSDK.start();
  console.log('set meter');
  
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
