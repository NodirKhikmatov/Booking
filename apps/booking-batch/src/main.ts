import { BookingBatchModule } from './booking-batch.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(BookingBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
