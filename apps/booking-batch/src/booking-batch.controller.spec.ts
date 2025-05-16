import { Test, TestingModule } from '@nestjs/testing';
import { BookingBatchController } from './booking-batch.controller';
import { BookingBatchService } from './booking-batch.service';

describe('BookingBatchController', () => {
  let bookingBatchController: BookingBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookingBatchController],
      providers: [BookingBatchService],
    }).compile();

    bookingBatchController = app.get<BookingBatchController>(BookingBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bookingBatchController.getHello()).toBe('Hello World!');
    });
  });
});
