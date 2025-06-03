import { registerEnumType } from '@nestjs/graphql';
/* eslint-disable prettier/prettier */
export enum Message {
	SOMETHING_WENT_WRONG = 'Something went wrong',
	NO_DATA_FOUND = 'no data is found',
	CREATE_FAILED = 'create is failed',
	UPDATE_FAILED = 'update is failed',
	UPLOAD_FAILED = 'upload is failed',

	USED_MEMBER_NICK_OR_PHONE = 'Already used member nick or phone',
	NO_MEMBER_NICK = 'No member with that member nick!',
	TOKEN_CREATION_FAILED = 'Token creation error',
	NO_NUMBER_NICK = 'you are inserting already used nick or phone!',
	WRONG_PASSWORD = 'wrong password entered, please try again!',
	BLOCKED_USER = 'User is blocked,  please contact Restaurant!',
	USED_NICK_PHONE = 'Nick or phone is already used!',
	NOT_AUTHENTICATED = 'Please login first!',
	TOKEN_NOT_EXIST = 'token is not exist',
	PROVIDE_ALLOWED_FORMAT = 'Provide onlt allowed format',
	ONLY_SPECIFIC_ROLES_ALLOWED = 'Allowed only for members with specific roles',
	NOT_ALLOWED_REQUEST = "NOT_ALLOWED_REQUEST",
	REMOVE_FAILED = "REMOVE_FAILED",
}

export enum Direction {
	ASC = 1,
	DESC = -1,
}

registerEnumType(Direction, {
	name: 'Direction',
});
