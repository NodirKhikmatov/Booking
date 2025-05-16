import { NestFactory } from '@nestjs/core';
import { BookingBatchModule } from './booking-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
