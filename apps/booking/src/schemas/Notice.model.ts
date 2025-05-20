import { NoticeCategory, NoticeStatus } from './../components/libs/enums/notice.enum';
import mongoose, { Schema } from 'mongoose';

const NoticeSchema = new Schema(
	{
		noticeCategory: {
			type: String,
			enum: NoticeCategory,
			required: true,
		},

		noticeStatus: {
			type: String,
			enum: NoticeStatus,
			default: NoticeStatus.ACTIVE,
		},

		noticeTitle: {
			type: String,
			required: true,
		},

		noticeContent: {
			type: String,
			required: true,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'notices' },
);

export default NoticeSchema;
