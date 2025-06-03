import { ObjectId } from 'bson';

export const availableAgentsSort = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];

export const shapeIntoMongoDbObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
