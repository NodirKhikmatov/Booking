import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from '../../booking/src/libs/dto/property/property';
import { Member } from '../../booking/src/libs/dto/member/member';
import { PropertyStatus } from '../../booking/src/libs/enums/property.enum';
import { MemberStatus } from '../../booking/src/libs/enums/member.enum';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,

		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	getHello(): string {
		return 'welcome nester-batch server';
	}

	public async batchRollback(): Promise<void> {
		await this.propertyModel
			.updateMany(
				{
					propertyStatus: PropertyStatus.ACTIVE,
				},
				{ propertyRank: 0 },
			)
			.exec();

		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
				},
				{ memberRank: 0 },
			)
			.exec();
	}

	public async batchTopProperties(): Promise<void> {
		const properties: Property[] = await this.propertyModel
			.find({
				propertyStatus: PropertyStatus.ACTIVE,
				propertyRank: 0,
			})
			.exec();

		const promisedList = properties.map(async (ele: Property) => {
			const { _id, propertyLikes, propertyViews } = ele;
			const rank = propertyLikes * 2 + propertyViews * 1;
			return await this.propertyModel.findByIdAndUpdate(_id, { propertyRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopAgents(): Promise<void> {
		const agents: Member[] = await this.memberModel
			.find({
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (ele: Member) => {
			const { _id, memberProperties, memberLikes, memberArticles, memberViews } = ele;
			const rank = memberProperties * 4 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}
}
