import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { BoardArticleService } from './board-article.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BoardArticle, BoardArticles } from '../../libs/dto/board-article/board-article';
import {
	AllBoardArticlesInquiry,
	BoardArticleInput,
	BoardArticlesInquiry,
} from '../../libs/dto/board-article/board-article.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoDbObjectId } from '../../libs/config';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LikeService } from '../like/like.service';

@Resolver()
export class BoardArticleResolver {
	constructor(
		private readonly boardArticleService: BoardArticleService,
		private readonly likeService: LikeService,
	) {}

	@UseGuards(AuthGuard)
	@Mutation(() => BoardArticle)
	public async createBoardArticle(
		@Args('input') input: BoardArticleInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticle> {
		console.log('Mutation:createBoardArticle ');
		return await this.boardArticleService.createBoardArticle(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => BoardArticle)
	public async getBoardArticle(
		@Args('articleId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticle> {
		console.log('Mutation getBoardArticle ');
		const articleId = shapeIntoMongoDbObjectId(input);
		return await this.boardArticleService.getBoardArticle(memberId, articleId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => BoardArticle)
	public async updateBoardArticle(
		@Args('input') input: BoardArticleUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticle> {
		console.log('Mutation: updateBoardArticle');
		input._id = shapeIntoMongoDbObjectId(input._id);

		return await this.boardArticleService.updateBoardArticle(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => BoardArticles)
	public async getBoardArticles(
		@Args('input') input: BoardArticlesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticles> {
		console.log('Mutation: getBoardArticles');
		return await this.boardArticleService.getBoardArticles(memberId, input);
	}

	//likes
	@UseGuards(AuthGuard)
	@Mutation(() => BoardArticle)
	public async likeTargetBoardArticle(
		@Args('articleId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticle> {
		console.log('Mutation: likeTargetBoardArticle');
		const likeRefId = shapeIntoMongoDbObjectId(input);
		return await this.boardArticleService.likeTargetBoardArticle(memberId, likeRefId);
	}

	/*admin */

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => BoardArticles)
	public async getAllBoardArticlesByAdmin(
		@Args('input') input: AllBoardArticlesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticles> {
		console.log('Mutation: getAllBoardArticlesByAdmin');
		return await this.boardArticleService.getAllBoardArticlesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => BoardArticle)
	public async updateBoardArticlesByAdmin(
		@Args('input') input: BoardArticleUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticle> {
		console.log('Mutation: updateBoardArticlesByAdmin');
		input._id = shapeIntoMongoDbObjectId(input._id);

		return await this.boardArticleService.updateBoardArticlesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => BoardArticle)
	public async removeBoardArticlesByAdmin(
		@Args('articleId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticle> {
		console.log('Mutation: removeBoardArticlesByAdmin');
		const articleId = shapeIntoMongoDbObjectId(input);

		return await this.boardArticleService.removeBoardArticlesByAdmin(articleId);
	}
}
