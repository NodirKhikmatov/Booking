import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [MemberResolver, MemberService],
})
export class MemberModule {}
