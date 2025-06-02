import { ObjectId } from 'bson';

export const shapeIntoMongoDbObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
