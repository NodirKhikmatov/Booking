import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingBatchService {
  getHello(): string {
    return 'Hello World!';
  }
}
