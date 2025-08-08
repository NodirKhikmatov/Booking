# Schema and Type Definitions Reference

## Overview

This document provides comprehensive documentation for all data schemas, GraphQL types, input types, and enums used in the Booking Platform.

## Table of Contents

1. [MongoDB Schemas](#mongodb-schemas)
2. [GraphQL Object Types](#graphql-object-types)
3. [GraphQL Input Types](#graphql-input-types)
4. [Enumerations](#enumerations)
5. [Utility Types](#utility-types)
6. [Validation Rules](#validation-rules)

## MongoDB Schemas

### Member Schema

```typescript
const MemberSchema = new Schema({
  memberType: {
    type: String,
    enum: ['USER', 'AGENT', 'ADMIN'],
    default: 'USER',
    required: true
  },
  memberStatus: {
    type: String,
    enum: ['ACTIVE', 'BLOCK', 'DELETE'],
    default: 'ACTIVE',
    required: true
  },
  memberAuthType: {
    type: String,
    enum: ['PHONE', 'EMAIL', 'TELEGRAM'],
    default: 'PHONE',
    required: true
  },
  memberPhone: {
    type: String,
    index: { unique: true, sparse: true },
    required: true
  },
  memberNick: {
    type: String,
    index: { unique: true, sparse: true },
    required: true
  },
  memberPassword: {
    type: String,
    select: false,
    required: true
  },
  memberFullName: String,
  memberJob: String,
  memberImage: {
    type: String,
    default: ''
  },
  memberAddress: String,
  memberDesc: String,
  memberProperties: {
    type: Number,
    default: 0
  },
  memberArticles: {
    type: Number,
    default: 0
  },
  memberFollowers: {
    type: Number,
    default: 0
  },
  memberFollowings: {
    type: Number,
    default: 0
  },
  memberPoints: {
    type: Number,
    default: 0
  },
  memberLikes: {
    type: Number,
    default: 0
  },
  memberViews: {
    type: Number,
    default: 0
  },
  memberComments: {
    type: Number,
    default: 0
  },
  memberRank: {
    type: Number,
    default: 0
  },
  memberWarnings: {
    type: Number,
    default: 0
  },
  memberBlocks: {
    type: Number,
    default: 0
  },
  deletedAt: Date
}, { 
  timestamps: true, 
  collection: 'members' 
});
```

**Indexes:**
- `memberPhone`: Unique, sparse
- `memberNick`: Unique, sparse

### Property Schema

```typescript
const PropertySchema = new Schema({
  propertyType: {
    type: String,
    enum: ['HOTEL', 'PENTHOUSE', 'VILLA'],
    required: true
  },
  propertyStatus: {
    type: String,
    enum: ['HOLD', 'ACTIVE', 'SOLD', 'DELETE'],
    default: 'ACTIVE'
  },
  propertyLocation: {
    type: String,
    enum: ['SEOUL', 'BUSAN', 'INCHEON', 'DAEGU', 'GYEONGJU', 'GWANGJU', 'CHONJU', 'DAEJON', 'JEJU'],
    required: true
  },
  propertyAddress: {
    type: String,
    required: true
  },
  propertyTitle: {
    type: String,
    required: true
  },
  propertyPrice: {
    type: Number,
    required: true
  },
  propertySquare: {
    type: Number,
    required: true
  },
  propertyBeds: {
    type: Number,
    required: true
  },
  propertyRooms: {
    type: Number,
    required: true
  },
  propertyViews: {
    type: Number,
    default: 0
  },
  propertyLikes: {
    type: Number,
    default: 0
  },
  propertyComments: {
    type: Number,
    default: 0
  },
  propertyFacility: {
    type: [String],
    default: []
  },
  propertyParking: String,
  propertyBathroom: {
    type: Number,
    default: 0
  },
  propertyRank: {
    type: Number,
    default: 0
  },
  propertyImages: {
    type: [String],
    required: true
  },
  propertyDesc: String,
  propertyBreakfast: {
    type: Boolean,
    default: false
  },
  propertyOffer: String,
  propertyCancellation: {
    type: Boolean,
    default: false
  },
  memberId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Member'
  },
  soldAt: Date,
  deletedAt: Date,
  constructedAt: Date
}, { 
  timestamps: true, 
  collection: 'properties' 
});
```

**Indexes:**
- Compound Index: `{ propertyType: 1, propertyLocation: 1, propertyTitle: 1, propertyPrice: 1 }` (unique)

### Comment Schema

```typescript
const CommentSchema = new Schema({
  commentStatus: {
    type: String,
    enum: ['ACTIVE', 'DELETE'],
    default: 'ACTIVE'
  },
  commentGroup: {
    type: String,
    enum: ['MEMBER', 'PROPERTY', 'ARTICLE'],
    required: true
  },
  commentContent: {
    type: String,
    required: true
  },
  commentRefId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  memberId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Member'
  }
}, { 
  timestamps: true, 
  collection: 'comments' 
});
```

### BoardArticle Schema

```typescript
const BoardArticleSchema = new Schema({
  articleCategory: {
    type: String,
    enum: ['FREE', 'HUMOR', 'QUESTION', 'REVIEW', 'NEWS'],
    required: true
  },
  articleStatus: {
    type: String,
    enum: ['ACTIVE', 'DELETE'],
    default: 'ACTIVE'
  },
  articleTitle: {
    type: String,
    required: true
  },
  articleContent: {
    type: String,
    required: true
  },
  articleImage: String,
  articleViews: {
    type: Number,
    default: 0
  },
  articleLikes: {
    type: Number,
    default: 0
  },
  articleComments: {
    type: Number,
    default: 0
  },
  memberId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Member'
  }
}, { 
  timestamps: true, 
  collection: 'board-articles' 
});
```

### Follow Schema

```typescript
const FollowSchema = new Schema({
  followingId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Member'
  },
  followerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Member'
  }
}, { 
  timestamps: true, 
  collection: 'follows' 
});
```

### Like Schema

```typescript
const LikeSchema = new Schema({
  likeGroup: {
    type: String,
    enum: ['MEMBER', 'PROPERTY', 'ARTICLE'],
    required: true
  },
  likeRefId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  memberId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Member'
  }
}, { 
  timestamps: true, 
  collection: 'likes' 
});
```

### View Schema

```typescript
const ViewSchema = new Schema({
  viewGroup: {
    type: String,
    enum: ['MEMBER', 'PROPERTY', 'ARTICLE'],
    required: true
  },
  viewRefId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  memberId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Member'
  }
}, { 
  timestamps: true, 
  collection: 'views' 
});
```

## GraphQL Object Types

### Member Type

```typescript
@ObjectType()
export class Member {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => MemberType)
  memberType: MemberType;

  @Field(() => MemberStatus)
  memberStatus: MemberStatus;

  @Field(() => MemberAuthType)
  memberAuthType: MemberAuthType;

  @Field(() => String)
  memberPhone: string;

  @Field(() => String)
  memberNick: string;

  @Field(() => String, { nullable: true })
  memberFullName?: string;

  @Field(() => String, { nullable: true })
  memberJob?: string;

  @Field(() => String, { nullable: true })
  memberImage?: string;

  @Field(() => String, { nullable: true })
  memberAddress?: string;

  @Field(() => String, { nullable: true })
  memberDesc?: string;

  @Field(() => Int)
  memberProperties: number;

  @Field(() => Int)
  memberArticles: number;

  @Field(() => Int)
  memberFollowers: number;

  @Field(() => Int)
  memberFollowings: number;

  @Field(() => Int)
  memberPoints: number;

  @Field(() => Int)
  memberLikes: number;

  @Field(() => Int)
  memberViews: number;

  @Field(() => Int)
  memberComments: number;

  @Field(() => Int)
  memberRank: number;

  @Field(() => Int)
  memberWarnings: number;

  @Field(() => Int)
  memberBlocks: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => String, { nullable: true })
  accessToken?: string;

  // Virtual fields for liked/followed status
  @Field(() => Boolean, { nullable: true })
  meLiked?: boolean;

  @Field(() => Boolean, { nullable: true })
  meFollowed?: boolean;
}
```

### Property Type

```typescript
@ObjectType()
export class Property {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => PropertyType)
  propertyType: PropertyType;

  @Field(() => PropertyStatus)
  propertyStatus: PropertyStatus;

  @Field(() => PropertyLocation)
  propertyLocation: PropertyLocation;

  @Field(() => String)
  propertyAddress: string;

  @Field(() => String)
  propertyTitle: string;

  @Field(() => Float)
  propertyPrice: number;

  @Field(() => Float)
  propertySquare: number;

  @Field(() => Int)
  propertyBeds: number;

  @Field(() => Int)
  propertyRooms: number;

  @Field(() => Int)
  propertyViews: number;

  @Field(() => Int)
  propertyLikes: number;

  @Field(() => Int)
  propertyComments: number;

  @Field(() => [String])
  propertyFacility: string[];

  @Field(() => String, { nullable: true })
  propertyParking?: string;

  @Field(() => Int)
  propertyBathroom: number;

  @Field(() => Int)
  propertyRank: number;

  @Field(() => [String])
  propertyImages: string[];

  @Field(() => String, { nullable: true })
  propertyDesc?: string;

  @Field(() => Boolean)
  propertyBreakfast: boolean;

  @Field(() => String, { nullable: true })
  propertyOffer?: string;

  @Field(() => Boolean)
  propertyCancellation: boolean;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  soldAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Date, { nullable: true })
  constructedAt?: Date;

  // Populated fields
  @Field(() => Member, { nullable: true })
  memberData?: Member;

  // Virtual fields
  @Field(() => Boolean, { nullable: true })
  meLiked?: boolean;
}
```

### Comment Type

```typescript
@ObjectType()
export class Comment {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => CommentStatus)
  commentStatus: CommentStatus;

  @Field(() => CommentGroup)
  commentGroup: CommentGroup;

  @Field(() => String)
  commentContent: string;

  @Field(() => String)
  commentRefId: ObjectId;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // Populated fields
  @Field(() => Member, { nullable: true })
  memberData?: Member;
}
```

### BoardArticle Type

```typescript
@ObjectType()
export class BoardArticle {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => BoardArticleCategory)
  articleCategory: BoardArticleCategory;

  @Field(() => BoardArticleStatus)
  articleStatus: BoardArticleStatus;

  @Field(() => String)
  articleTitle: string;

  @Field(() => String)
  articleContent: string;

  @Field(() => String, { nullable: true })
  articleImage?: string;

  @Field(() => Int)
  articleViews: number;

  @Field(() => Int)
  articleLikes: number;

  @Field(() => Int)
  articleComments: number;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  // Populated fields
  @Field(() => Member, { nullable: true })
  memberData?: Member;

  // Virtual fields
  @Field(() => Boolean, { nullable: true })
  meLiked?: boolean;
}
```

## GraphQL Input Types

### Member Input Types

```typescript
@InputType()
export class MemberInput {
  @Field(() => MemberType, { nullable: true })
  @IsOptional()
  @IsEnum(MemberType)
  memberType?: MemberType;

  @Field(() => String)
  @IsNotEmpty()
  @Length(3, 50)
  memberNick: string;

  @Field(() => String)
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  memberPhone: string;

  @Field(() => String)
  @IsNotEmpty()
  @Length(8, 100)
  memberPassword: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 100)
  memberFullName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 50)
  memberJob?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  memberAddress?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 500)
  memberDesc?: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsNotEmpty()
  memberNick: string;

  @Field(() => String)
  @IsNotEmpty()
  memberPassword: string;
}

@InputType()
export class MembersInquiry {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sort?: string;

  @Field(() => Direction, { nullable: true })
  @IsOptional()
  direction?: Direction;

  @Field(() => MemberType, { nullable: true })
  @IsOptional()
  @IsEnum(MemberType)
  type?: MemberType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string;
}
```

### Property Input Types

```typescript
@InputType()
export class PropertyInput {
  @Field(() => PropertyType)
  @IsNotEmpty()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @Field(() => PropertyLocation)
  @IsNotEmpty()
  @IsEnum(PropertyLocation)
  propertyLocation: PropertyLocation;

  @Field(() => String)
  @IsNotEmpty()
  @Length(5, 200)
  propertyTitle: string;

  @Field(() => Float)
  @IsNotEmpty()
  @Min(0)
  propertyPrice: number;

  @Field(() => Float)
  @IsNotEmpty()
  @Min(1)
  propertySquare: number;

  @Field(() => Int)
  @IsNotEmpty()
  @Min(0)
  propertyBeds: number;

  @Field(() => Int)
  @IsNotEmpty()
  @Min(1)
  propertyRooms: number;

  @Field(() => String)
  @IsNotEmpty()
  @Length(10, 300)
  propertyAddress: string;

  @Field(() => [String])
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  propertyImages: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 1000)
  propertyDesc?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ArrayMaxSize(20)
  propertyFacility?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  propertyParking?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  propertyBathroom?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  propertyBreakfast?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  propertyOffer?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  propertyCancellation?: boolean;

  memberId?: ObjectId;
}

@InputType()
export class PropertiesInquiry {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sort?: string;

  @Field(() => Direction, { nullable: true })
  @IsOptional()
  direction?: Direction;

  @Field(() => PISearch, { nullable: true })
  @IsOptional()
  search?: PISearch;
}

@InputType()
export class PISearch {
  @Field(() => [PropertyLocation], { nullable: true })
  @IsOptional()
  locationList?: PropertyLocation[];

  @Field(() => [PropertyType], { nullable: true })
  @IsOptional()
  typeList?: PropertyType[];

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  roomsList?: number[];

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  bedsList?: number[];

  @Field(() => Range, { nullable: true })
  @IsOptional()
  pricesRange?: Range;

  @Field(() => Range, { nullable: true })
  @IsOptional()
  periodsRange?: Range;

  @Field(() => Range, { nullable: true })
  @IsOptional()
  squaresRange?: Range;

  @Field(() => String, { nullable: true })
  @IsOptional()
  text?: string;
}

@InputType()
export class Range {
  @Field(() => Float)
  @IsNotEmpty()
  @Min(0)
  start: number;

  @Field(() => Float)
  @IsNotEmpty()
  @Min(0)
  end: number;
}
```

## Enumerations

### Member Enums

```typescript
export enum MemberType {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
  DELETE = 'DELETE'
}

export enum MemberAuthType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  TELEGRAM = 'TELEGRAM'
}
```

### Property Enums

```typescript
export enum PropertyType {
  HOTEL = 'HOTEL',
  PENTHOUSE = 'PENTHOUSE',
  VILLA = 'VILLA'
}

export enum PropertyStatus {
  HOLD = 'HOLD',
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  DELETE = 'DELETE'
}

export enum PropertyLocation {
  SEOUL = 'SEOUL',
  BUSAN = 'BUSAN',
  INCHEON = 'INCHEON',
  DAEGU = 'DAEGU',
  GYEONGJU = 'GYEONGJU',
  GWANGJU = 'GWANGJU',
  CHONJU = 'CHONJU',
  DAEJON = 'DAEJON',
  JEJU = 'JEJU'
}
```

### Common Enums

```typescript
export enum Direction {
  ASC = 1,
  DESC = -1
}

export enum Message {
  SOMETHING_WENT_WRONG = 'Something went wrong!',
  NO_DATA_FOUND = 'No data found!',
  CREATE_FAILED = 'Create failed!',
  UPDATE_FAILED = 'Update failed!'
}

export enum CommentStatus {
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE'
}

export enum CommentGroup {
  MEMBER = 'MEMBER',
  PROPERTY = 'PROPERTY',
  ARTICLE = 'ARTICLE'
}

export enum LikeGroup {
  MEMBER = 'MEMBER',
  PROPERTY = 'PROPERTY',
  ARTICLE = 'ARTICLE'
}

export enum ViewGroup {
  MEMBER = 'MEMBER',
  PROPERTY = 'PROPERTY',
  ARTICLE = 'ARTICLE'
}

export enum BoardArticleCategory {
  FREE = 'FREE',
  HUMOR = 'HUMOR',
  QUESTION = 'QUESTION',
  REVIEW = 'REVIEW',
  NEWS = 'NEWS'
}

export enum BoardArticleStatus {
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE'
}
```

## Utility Types

### Pagination Types

```typescript
@ObjectType()
export class Members {
  @Field(() => [Member])
  list: Member[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

@ObjectType()
export class Properties {
  @Field(() => [Property])
  list: Property[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

@ObjectType()
export class TotalCounter {
  @Field(() => Int, { nullable: true })
  total?: number;
}
```

### Update Types

```typescript
@InputType()
export class MemberUpdate {
  @Field(() => String)
  @IsNotEmpty()
  _id: ObjectId;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(3, 50)
  memberNick?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 100)
  memberFullName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  memberImage?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 50)
  memberJob?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  memberAddress?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 500)
  memberDesc?: string;
}

@InputType()
export class PropertyUpdate {
  @Field(() => String)
  @IsNotEmpty()
  _id: ObjectId;

  @Field(() => PropertyType, { nullable: true })
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @Field(() => PropertyStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PropertyStatus)
  propertyStatus?: PropertyStatus;

  @Field(() => PropertyLocation, { nullable: true })
  @IsOptional()
  @IsEnum(PropertyLocation)
  propertyLocation?: PropertyLocation;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(5, 200)
  propertyTitle?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  propertyPrice?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 1000)
  propertyDesc?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ArrayMaxSize(10)
  propertyImages?: string[];
}
```

## Validation Rules

### Member Validation

- **memberNick**: 3-50 characters, unique
- **memberPhone**: Valid phone number format (E.164), unique
- **memberPassword**: 8-100 characters minimum
- **memberFullName**: 2-100 characters (optional)
- **memberJob**: 2-50 characters (optional)
- **memberDesc**: 0-500 characters (optional)

### Property Validation

- **propertyTitle**: 5-200 characters
- **propertyPrice**: Minimum 0
- **propertySquare**: Minimum 1
- **propertyBeds**: Minimum 0
- **propertyRooms**: Minimum 1
- **propertyAddress**: 10-300 characters
- **propertyImages**: 1-10 images required
- **propertyDesc**: 0-1000 characters (optional)
- **propertyFacility**: Maximum 20 items (optional)
- **propertyBathroom**: Minimum 0 (optional)

### Comment Validation

- **commentContent**: Required, non-empty string
- **commentGroup**: Must be valid enum value
- **commentRefId**: Valid ObjectId

### BoardArticle Validation

- **articleTitle**: Required, non-empty string
- **articleContent**: Required, non-empty string
- **articleCategory**: Must be valid enum value

### File Upload Validation

- **Supported MIME types**: 
  - `image/jpeg`
  - `image/jpg`
  - `image/png`
- **Maximum file size**: 15MB per file
- **Maximum files**: 10 files per request

---

This schema reference provides complete documentation for all data structures and validation rules used throughout the Booking Platform. All schemas include proper indexing, validation, and relationship definitions for optimal performance and data integrity.