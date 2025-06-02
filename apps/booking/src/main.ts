import { AppModule } from './app.module';
import { LoggingInterceptor } from './libs/interceptor/login.interceptor';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new LoggingInterceptor());
	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
