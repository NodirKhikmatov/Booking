import { BookingBatchController } from './booking-batch.controller';
import { BookingBatchService } from './booking-batch.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [BookingBatchController],
  providers: [BookingBatchService],
})
export class BookingBatchModule {}
