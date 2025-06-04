import { AuthModule } from '../auth/auth.module';
import { BoardArticleResolver } from './board-article.resolver';
import BoardArticleSchema from '../../schemas/BoardArticle.model';
import { BoardArticleService } from './board-article.service';
import { LikeModule } from '../like/like.module';
import { MemberModule } from '../member/member.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ViewModule } from '../view/view.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'BoardArticle', schema: BoardArticleSchema }]),
		AuthModule,
		ViewModule,
		MemberModule,
		LikeModule,
	],
	providers: [BoardArticleResolver, BoardArticleService],
	exports: [BoardArticleService],
})
export class BoardArticleModule {}
