import { Module } from '@nestjs/common';
import { BookingBatchController } from './booking-batch.controller';
import { BookingBatchService } from './booking-batch.service';

@Module({
  imports: [],
  controllers: [BookingBatchController],
  providers: [BookingBatchService],
})
export class BookingBatchModule {}
