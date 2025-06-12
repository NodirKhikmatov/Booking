import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { BookingBatchModule } from '../src/batch.module';
import { INestApplication } from '@nestjs/common';

describe('BookingBatchController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [BookingBatchModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/ (GET)', () => {
		return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
	});
});
