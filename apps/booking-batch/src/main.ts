import { BatchModule } from './batch.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
	const app = await NestFactory.create(BatchModule);
	await app.listen(process.env.PORT_BATCH ?? 3001, '0.0.0.0');
}
bootstrap();
