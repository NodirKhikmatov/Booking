import { Controller, Get } from '@nestjs/common';
import { BookingBatchService } from './booking-batch.service';

@Controller()
export class BookingBatchController {
  constructor(private readonly bookingBatchService: BookingBatchService) {}

  @Get()
  getHello(): string {
    return this.bookingBatchService.getHello();
  }
}
