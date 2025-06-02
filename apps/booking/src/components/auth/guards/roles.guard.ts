import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { Message } from 'apps/booking/src/libs/enums/common.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext | any): Promise<boolean> {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!roles) return true;

		console.info(`--- @guard() Authentication [RolesGuard]: ${roles} ---`);

		if (context.contextType === 'graphql') {
			const request = context.getArgByIndex(2).req;
			const bearerToken = request.headers.authorization;

			if (!bearerToken) throw new BadRequestException(Message.TOKEN_NOT_EXIST);

			const token = bearerToken.split(' ')[1];
			const authMember = await this.authService.verifyToken(token);

			const hasRole = () => roles.includes(authMember?.memberType);
			const hasPermission: boolean = hasRole();

			if (!authMember || !hasPermission) {
				throw new ForbiddenException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);
			}

			console.log('memberNick[roles] =>', authMember.memberNick);
			request.body.authMember = authMember;
			return true;
		}

		// fallback for non-GraphQL contexts
		return false;
	}
}
