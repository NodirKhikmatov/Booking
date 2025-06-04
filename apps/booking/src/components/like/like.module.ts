import LikeSchema from '../../schemas/Like.model';
import { LikeService } from './like.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }])],
	providers: [LikeService],
	exports: [LikeService],
})
export class LikeModule {}
