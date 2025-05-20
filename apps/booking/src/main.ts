import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
