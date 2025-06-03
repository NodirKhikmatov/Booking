import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { Message } from '../../libs/enums/common.enum';
import { Property } from '../../libs/dto/property/property';
import { MemberService } from '../member/member.service';
import { T, StatisticModifier } from '../../libs/types/common';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { ViewGroup } from '../../libs/enums/view.enum';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		private memberService: MemberService,
		private viewService: ViewService,
	) {}

	public async createProperty(input: PropertyInput): Promise<Property> {
		try {
			const result = await this.propertyModel.create(input);

			//increase memberPoints +1
			await this.memberService.memberStateEditor({ _id: result.memberId, targetKey: 'memberProperties', modifier: 1 });
			return result;
		} catch (err) {
			console.log('Error, service.model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
	public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Property> {
		const search = { _id: propertyId, propertyStatus: PropertyStatus.ACTIVE };

		const targetProperty = (await this.propertyModel.findOne(search).lean().exec()) as Property | null;
		if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId, viewRefId: propertyId, viewGroup: ViewGroup.PROPERTY };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.propertyStatsEditor({ _id: propertyId, targetKey: 'propertyViews', modifier: 1 });
				if (typeof targetProperty.propertyViews === 'number') {
					targetProperty.propertyViews++;
				}
			}
		}

		targetProperty.memberData = await this.memberService.getMember(targetProperty.memberId);

		return targetProperty;
	}

	public async propertyStatsEditor(input: StatisticModifier): Promise<Property | null> {
		const { _id, targetKey, modifier } = input;
		return await this.propertyModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}
}
