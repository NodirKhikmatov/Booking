import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { Message } from '../../libs/enums/common.enum';
import { Property } from '../../libs/dto/property/property';
import { MemberService } from '../member/member.service';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		private memberService: MemberService,
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
}
