import { NestFactory } from '@nestjs/core';
import { metrics } from '@opentelemetry/api';
import { AppModule } from './app.module';
import { meterProvider } from './metrics';
import { otelSDK } from './tracer';

async function bootstrap() {
  await otelSDK.start();
  console.log('set meter');
  
  const result = metrics.setGlobalMeterProvider(meterProvider); 

  console.log(result);
  
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
