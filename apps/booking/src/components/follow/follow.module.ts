import { AuthModule } from '../auth/auth.module';
import { FollowResolver } from './follow.resolver';
import FollowSchema from '../../schemas/Follow.model';
import { FollowService } from './follow.service';
import { MemberModule } from '../member/member.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]), AuthModule, MemberModule],
	providers: [FollowResolver, FollowService],
	exports: [FollowService],
})
export class FollowModule {}
