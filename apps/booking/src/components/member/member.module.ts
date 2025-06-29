import { AuthModule } from '../auth/auth.module';
import FollowSchema from '../../schemas/Follow.model';
import { LikeModule } from '../like/like.module';
import { MemberResolver } from './member.resolver';
import MemberSchema from '../../schemas/Member.model';
import { MemberService } from './member.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ViewModule } from '../view/view.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
		AuthModule,
		ViewModule,
		LikeModule,
	],

	providers: [MemberResolver, MemberService],
	exports: [MemberService],
})
export class MemberModule {}
