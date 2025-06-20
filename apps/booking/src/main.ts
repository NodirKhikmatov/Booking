import * as express from 'express';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './libs/interceptor/login.interceptor';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new LoggingInterceptor());
	app.enableCors({ origin: true, credentials: true });

	// ✅ FIX: dynamically import graphql-upload here
	// @ts-ignore
	const { graphqlUploadExpress } = await import('graphql-upload');
	
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 }));

	app.useWebSocketAdapter(new WsAdapter(app));
	app.use('/uploads', express.static('./uploads'));
	await app.listen(process.env.PORT_API ?? 3000, '0.0.0.0');
}
bootstrap();
