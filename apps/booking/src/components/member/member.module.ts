import { MemberResolver } from './member.resolver';
import MemberSchema from '../../schemas/Member.model';
import { MemberService } from './member.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }])],
	providers: [MemberResolver, MemberService],
})
export class MemberModule {}
