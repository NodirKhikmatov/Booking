import { AuthModule } from '../auth/auth.module';
import { MemberResolver } from './member.resolver';
import MemberSchema from '../../schemas/Member.model';
import { MemberService } from './member.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ViewModule } from '../view/view.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]), AuthModule, ViewModule],
	providers: [MemberResolver, MemberService],
})
export class MemberModule {}
