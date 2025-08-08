# Booking Platform API Documentation

## Overview

This is a comprehensive documentation for the Booking Platform API built with NestJS, GraphQL, MongoDB, and WebSocket support. The platform provides functionality for property booking, user management, social interactions, and real-time communication.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [GraphQL API](#graphql-api)
4. [REST API](#rest-api)
5. [WebSocket API](#websocket-api)
6. [Data Models](#data-models)
7. [Enums](#enums)
8. [Examples](#examples)
9. [Batch Operations](#batch-operations)

## Getting Started

### Base URLs
- **Main API**: `http://localhost:3005`
- **GraphQL Playground**: `http://localhost:3005/graphql`
- **WebSocket**: `ws://localhost:3005`

### Prerequisites
- Node.js 18+
- MongoDB
- Valid JWT token for authenticated endpoints

### Installation
```bash
npm install
npm run start:dev
```

## Authentication

The API uses JWT tokens for authentication. Include the token in your requests:

### Headers
```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **USER**: Regular platform users
- **AGENT**: Property agents who can create and manage properties
- **ADMIN**: Platform administrators

## GraphQL API

### Authentication Mutations

#### signup
Creates a new user account.

```graphql
mutation Signup($input: MemberInput!) {
  signup(input: $input) {
    _id
    memberType
    memberStatus
    memberNick
    memberPhone
    memberImage
    memberPoints
    accessToken
  }
}
```

**Input Variables:**
```graphql
{
  "input": {
    "memberType": "USER",
    "memberNick": "john_doe",
    "memberPhone": "+1234567890",
    "memberPassword": "securePassword123",
    "memberFullName": "John Doe"
  }
}
```

#### login
Authenticates a user and returns access token.

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    _id
    memberType
    memberNick
    memberPhone
    memberImage
    memberPoints
    accessToken
  }
}
```

**Input Variables:**
```graphql
{
  "input": {
    "memberNick": "john_doe",
    "memberPassword": "securePassword123"
  }
}
```

### Member Queries & Mutations

#### checkAuth
Verifies the current user's authentication status.

```graphql
query CheckAuth {
  checkAuth
}
```

#### updateMember
Updates the current user's profile information.

```graphql
mutation UpdateMember($input: MemberUpdate!) {
  updateMember(input: $input) {
    _id
    memberNick
    memberFullName
    memberImage
    memberDesc
  }
}
```

#### getMembers
Retrieves a list of members with pagination and filtering.

```graphql
query GetMembers($input: MembersInquiry!) {
  getMembers(input: $input) {
    list {
      _id
      memberType
      memberNick
      memberImage
      memberProperties
      memberFollowers
    }
    metaCounter {
      total
    }
  }
}
```

#### getAgents
Retrieves a list of property agents.

```graphql
query GetAgents($input: AgentsInquiry!) {
  getAgents(input: $input) {
    list {
      _id
      memberNick
      memberImage
      memberProperties
      memberDesc
    }
    metaCounter {
      total
    }
  }
}
```

### Property Queries & Mutations

#### createProperty
Creates a new property listing (Agent role required).

```graphql
mutation CreateProperty($input: PropertyInput!) {
  createProperty(input: $input) {
    _id
    propertyType
    propertyLocation
    propertyTitle
    propertyPrice
    propertyImages
    propertyStatus
  }
}
```

**Input Variables:**
```graphql
{
  "input": {
    "propertyType": "HOTEL",
    "propertyLocation": "SEOUL",
    "propertyTitle": "Luxury Hotel in Gangnam",
    "propertyPrice": 250000,
    "propertySquare": 45,
    "propertyBeds": 2,
    "propertyRooms": 3,
    "propertyAddress": "123 Gangnam-gu, Seoul",
    "propertyImages": ["image1.jpg", "image2.jpg"],
    "propertyDesc": "Beautiful hotel with city view"
  }
}
```

#### getProperty
Retrieves a single property by ID.

```graphql
query GetProperty($propertyId: String!) {
  getProperty(propertyId: $propertyId) {
    _id
    propertyType
    propertyLocation
    propertyTitle
    propertyPrice
    propertyImages
    propertyViews
    propertyLikes
    memberData {
      _id
      memberNick
      memberImage
    }
  }
}
```

#### getProperties
Retrieves a list of properties with filtering and pagination.

```graphql
query GetProperties($input: PropertiesInquiry!) {
  getProperties(input: $input) {
    list {
      _id
      propertyType
      propertyLocation
      propertyTitle
      propertyPrice
      propertyImages
      propertyViews
      propertyLikes
    }
    metaCounter {
      total
    }
  }
}
```

#### updateProperty
Updates a property (only by the property owner).

```graphql
mutation UpdateProperty($input: PropertyUpdate!) {
  updateProperty(input: $input) {
    _id
    propertyTitle
    propertyPrice
    propertyDesc
    propertyStatus
  }
}
```

#### likeTargetProperty
Likes or unlikes a property.

```graphql
mutation LikeTargetProperty($input: String!) {
  likeTargetProperty(input: $input) {
    _id
    propertyLikes
  }
}
```

### Follow System

#### subscribe
Follow another member.

```graphql
mutation Subscribe($input: String!) {
  subscribe(input: $input) {
    _id
    followingId
    followerId
  }
}
```

#### unsubscribe
Unfollow a member.

```graphql
mutation Unsubscribe($input: String!) {
  unsubscribe(input: $input) {
    _id
    followingId
    followerId
  }
}
```

#### getMemberFollowers
Get a member's followers.

```graphql
query GetMemberFollowers($input: FollowInquiry!) {
  getMemberFollowers(input: $input) {
    list {
      _id
      followerData {
        _id
        memberNick
        memberImage
      }
    }
    metaCounter {
      total
    }
  }
}
```

### Comment System

#### createComment
Create a comment on a property.

```graphql
mutation CreateComment($input: CommentInput!) {
  createComment(input: $input) {
    _id
    commentContent
    commentGroup
    memberData {
      _id
      memberNick
      memberImage
    }
  }
}
```

#### getComments
Get comments for a specific target.

```graphql
query GetComments($input: CommentsInquiry!) {
  getComments(input: $input) {
    list {
      _id
      commentContent
      commentGroup
      memberData {
        _id
        memberNick
        memberImage
      }
    }
    metaCounter {
      total
    }
  }
}
```

### Board Article System

#### createBoardArticle
Create a new board article.

```graphql
mutation CreateBoardArticle($input: BoardArticleInput!) {
  createBoardArticle(input: $input) {
    _id
    articleCategory
    articleTitle
    articleContent
    articleImage
    articleViews
    articleLikes
  }
}
```

#### getBoardArticles
Get board articles with filtering.

```graphql
query GetBoardArticles($input: BoardArticlesInquiry!) {
  getBoardArticles(input: $input) {
    list {
      _id
      articleCategory
      articleTitle
      articleContent
      articleViews
      articleLikes
      memberData {
        _id
        memberNick
        memberImage
      }
    }
    metaCounter {
      total
    }
  }
}
```

## REST API

### Base Endpoint

#### GET /
Returns a welcome message.

**Response:**
```json
{
  "message": "Hello World!"
}
```

### File Upload

The API supports file uploads through GraphQL with multipart form data.

**Supported formats:**
- Images: `.jpg`, `.jpeg`, `.png`
- Maximum file size: 15MB
- Maximum files per request: 10

## WebSocket API

### Connection

Connect to WebSocket with authentication:
```
ws://localhost:3005?token=<your_jwt_token>
```

### Events

#### Client → Server Events

##### `getMessages`
Retrieve chat message history.

**Payload:**
```json
{
  "event": "getMessages"
}
```

##### `createMessage`
Send a new chat message.

**Payload:**
```json
{
  "event": "createMessage",
  "text": "Hello everyone!",
  "memberData": {
    "_id": "user_id",
    "memberNick": "john_doe",
    "memberImage": "profile.jpg"
  }
}
```

#### Server → Client Events

##### `info`
Server information about connected clients.

**Payload:**
```json
{
  "event": "info",
  "totalClients": 5,
  "memberData": {
    "_id": "user_id",
    "memberNick": "john_doe"
  },
  "action": "joined"
}
```

##### `message`
Broadcast message to all clients.

**Payload:**
```json
{
  "event": "message",
  "text": "Hello everyone!",
  "memberData": {
    "_id": "user_id",
    "memberNick": "john_doe",
    "memberImage": "profile.jpg"
  }
}
```

## Data Models

### Member Model

```typescript
interface Member {
  _id: ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberAuthType: MemberAuthType;
  memberPhone: string;
  memberNick: string;
  memberPassword: string; // (hidden in responses)
  memberFullName?: string;
  memberJob?: string;
  memberImage?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberProperties: number;
  memberArticles: number;
  memberFollowers: number;
  memberFollowings: number;
  memberPoints: number;
  memberLikes: number;
  memberViews: number;
  memberComments: number;
  memberRank: number;
  memberWarnings: number;
  memberBlocks: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Property Model

```typescript
interface Property {
  _id: ObjectId;
  propertyType: PropertyType;
  propertyStatus: PropertyStatus;
  propertyLocation: PropertyLocation;
  propertyAddress: string;
  propertyTitle: string;
  propertyPrice: number;
  propertySquare: number;
  propertyBeds: number;
  propertyRooms: number;
  propertyViews: number;
  propertyLikes: number;
  propertyComments: number;
  propertyFacility: string[];
  propertyParking?: string;
  propertyBathroom: number;
  propertyRank: number;
  propertyImages: string[];
  propertyDesc?: string;
  propertyBreakfast: boolean;
  propertyOffer?: string;
  propertyCancellation: boolean;
  memberId: ObjectId;
  soldAt?: Date;
  deletedAt?: Date;
  constructedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Comment Model

```typescript
interface Comment {
  _id: ObjectId;
  commentStatus: CommentStatus;
  commentGroup: CommentGroup;
  commentContent: string;
  commentRefId: ObjectId;
  memberId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### BoardArticle Model

```typescript
interface BoardArticle {
  _id: ObjectId;
  articleCategory: BoardArticleCategory;
  articleStatus: BoardArticleStatus;
  articleTitle: string;
  articleContent: string;
  articleImage?: string;
  articleViews: number;
  articleLikes: number;
  articleComments: number;
  memberId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

## Enums

### MemberType
```typescript
enum MemberType {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}
```

### MemberStatus
```typescript
enum MemberStatus {
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
  DELETE = 'DELETE'
}
```

### PropertyType
```typescript
enum PropertyType {
  HOTEL = 'HOTEL',
  PENTHOUSE = 'PENTHOUSE',
  VILLA = 'VILLA'
}
```

### PropertyStatus
```typescript
enum PropertyStatus {
  HOLD = 'HOLD',
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  DELETE = 'DELETE'
}
```

### PropertyLocation
```typescript
enum PropertyLocation {
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

## Examples

### Complete User Registration and Property Creation Flow

#### 1. User Registration
```typescript
const signupMutation = `
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
      _id
      memberNick
      memberType
      accessToken
    }
  }
`;

const signupVariables = {
  input: {
    memberType: "AGENT",
    memberNick: "luxury_agent",
    memberPhone: "+821234567890",
    memberPassword: "securePass123",
    memberFullName: "Kim Min-jun"
  }
};
```

#### 2. Property Creation (Agent only)
```typescript
const createPropertyMutation = `
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
      _id
      propertyTitle
      propertyPrice
      propertyStatus
    }
  }
`;

const propertyVariables = {
  input: {
    propertyType: "PENTHOUSE",
    propertyLocation: "SEOUL",
    propertyTitle: "Luxury Penthouse in Gangnam",
    propertyPrice: 500000,
    propertySquare: 120,
    propertyBeds: 3,
    propertyRooms: 4,
    propertyBathroom: 2,
    propertyAddress: "456 Gangnam-gu, Seoul",
    propertyImages: ["penthouse1.jpg", "penthouse2.jpg"],
    propertyDesc: "Stunning penthouse with panoramic city views",
    propertyBreakfast: true,
    propertyCancellation: true
  }
};
```

#### 3. Property Search
```typescript
const getPropertiesQuery = `
  query GetProperties($input: PropertiesInquiry!) {
    getProperties(input: $input) {
      list {
        _id
        propertyTitle
        propertyPrice
        propertyLocation
        propertyImages
        memberData {
          memberNick
          memberImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

const searchVariables = {
  input: {
    page: 1,
    limit: 10,
    search: {
      locationList: ["SEOUL"],
      typeList: ["PENTHOUSE"],
      pricesRange: {
        start: 100000,
        end: 1000000
      }
    }
  }
};
```

### WebSocket Chat Implementation

```javascript
const ws = new WebSocket('ws://localhost:3005?token=' + authToken);

ws.onopen = function() {
  console.log('Connected to chat');
  
  // Get message history
  ws.send(JSON.stringify({
    event: 'getMessages'
  }));
};

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  
  switch(data.event) {
    case 'info':
      console.log(`Total clients: ${data.totalClients}`);
      break;
    case 'message':
      displayMessage(data.text, data.memberData);
      break;
  }
};

// Send a message
function sendMessage(text) {
  ws.send(JSON.stringify({
    event: 'createMessage',
    text: text,
    memberData: {
      _id: currentUser._id,
      memberNick: currentUser.memberNick,
      memberImage: currentUser.memberImage
    }
  }));
}
```

## Batch Operations

The booking-batch application provides automated maintenance operations:

### Available Batch Operations

#### Rank Reset
Resets all property and member rankings to 0.

```bash
npm run start:prod:batch
```

#### Top Properties Calculation
Calculates and updates property rankings based on likes and views.

**Ranking Formula:**
```
propertyRank = (propertyLikes * 2) + propertyViews
```

#### Top Members Calculation
Calculates and updates member rankings based on various engagement metrics.

**Ranking Formula:**
```
memberRank = (memberLikes * 2) + 
             (memberViews * 1) + 
             (memberComments * 1) + 
             (memberFollowers * 3)
```

### Batch Service Methods

```typescript
class BatchService {
  // Reset all rankings
  async batchRollback(): Promise<void>
  
  // Calculate top properties
  async batchTopProperties(): Promise<void>
  
  // Calculate top members  
  async batchTopMembers(): Promise<void>
}
```

## Error Handling

### GraphQL Errors

All GraphQL errors are formatted with the following structure:

```json
{
  "errors": [{
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }]
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing token
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `ALREADY_EXISTS`: Resource already exists

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **GraphQL queries**: 100 requests per minute per IP
- **File uploads**: 10 requests per minute per user
- **WebSocket connections**: 5 connections per user

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS enabled with credentials
- File upload validation
- Input sanitization and validation
- Role-based access control

---

For more detailed information or support, please refer to the source code or contact the development team.