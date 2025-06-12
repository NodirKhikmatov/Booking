import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import MemberSchema from '../../booking/src/schemas/Member.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PropertySchema from '../../booking/src/schemas/Property.model';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule,
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([{ name: 'Property', schema: PropertySchema }]),
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
	],

	controllers: [BatchController],
	providers: [BatchService],
})
export class BatchModule {}
