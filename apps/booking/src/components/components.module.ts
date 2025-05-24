import { AuthModule } from './auth/auth.module';
import { BoardActicleModule } from './board-acticle/board-acticle.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { MemberModule } from './member/member.module';
import { Module } from '@nestjs/common';
import { PropertyModule } from './property/property.module';
import { ViewModule } from './view/view.module';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		PropertyModule,
		BoardActicleModule,
		LikeModule,
		ViewModule,
		CommentModule,
		FollowModule,
	],
})
export class ComponentsModule {}
