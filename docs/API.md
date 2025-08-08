## Booking API Documentation

### Overview
This project exposes:
- GraphQL API (code-first, Apollo Driver) at `/graphql`
- A small REST endpoint at `/`
- WebSocket gateway (ws) for real-time messaging
- Scheduled batch jobs (cron) in the `booking-batch` app

Requires Node.js, NestJS, and MongoDB per app configuration. See `package.json` scripts.

### How to run locally
- Install: `npm install`
- Dev: `npm run start:dev` (main app), `npm run start:dev:batch` (batch app)
- Prod: `npm run build` then `npm run start:prod`

GraphQL Playground is enabled (`autoSchemaFile: true`, `playground: true`, `introspection: true`).

### Authentication
- Bearer token via `Authorization: Bearer <JWT>`
- Guards:
  - `AuthGuard`: requires a valid token; injects `authMember` into GraphQL context
  - `RolesGuard`: requires one of the roles set on the resolver handler via `@Roles(...)`
  - `WithoutGuard`: optional auth; attempts to enrich context with user if token provided
- Use `login` mutation to obtain `accessToken`.

Example login and using token:
```graphql
mutation Login {
  login(input: { memberNick: "demoUser", memberPassword: "secret" }) {
    _id
    memberNick
    memberType
    accessToken
  }
}
```
Then add header on subsequent calls:
```
Authorization: Bearer <accessToken>
```

### REST API
- GET `/` → returns "Hello World!"
  - Example:
    ```bash
    curl -s http://localhost:3000/
    ```

### GraphQL API
Endpoint: `POST http://localhost:3000/graphql`

Below are public operations grouped by domain. Input/output types reference the DTOs under `apps/booking/src/libs/dto/**` and enums under `apps/booking/src/libs/enums/**`.

Notes:
- Pagination inputs typically require `page` (>=1) and `limit` (>=1).
- Sorting often uses `sort` with allowed values and `direction` of `ASC|DESC`.

#### App
- Query `sayHello(): String` — health check
```graphql
query { sayHello }
```

#### Member
- Mutation `signup(input: MemberInput): Member`
- Mutation `login(input: LoginInput): Member`
- Query `checkAuth: String` — AuthGuard
- Query `checkAuthRoles: String` — RolesGuard(USER, AGENT)
- Mutation `updateMember(input: MemberUpdate): Member` — AuthGuard
- Query `getMember(memberId: String!): Member` — WithoutGuard
- Query `getAgents(input: AgentsInquiry): Members` — WithoutGuard
- Query `getAllMembersByAdmin(input: MembersInquiry): Members` — RolesGuard(ADMIN)
- Mutation `updateMemberByAdmin(input: MemberUpdate): Member` — RolesGuard(ADMIN)
- Mutation `imageUploader(file: Upload!, target: String!): String` — AuthGuard
- Mutation `imagesUploader(files: [Upload!]!, target: String!): [String]` — AuthGuard
- Mutation `likeTargetMember(memberId: String!): Member` — AuthGuard

Examples:
```graphql
mutation Signup {
  signup(input: { memberNick: "demoUser", memberPassword: "secret", memberPhone: "+82-10-0000-0000" }) {
    _id
    memberNick
    memberType
  }
}
```
```graphql
query GetAgents {
  getAgents(input: { page: 1, limit: 10, search: { text: "hotel" } }) {
    list { _id memberNick memberType memberLikes memberViews }
    metaCounter { total }
  }
}
```

File upload (multipart request) example (Apollo Server v4 requires `graphql-upload` integration):
```bash
curl http://localhost:3000/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -F operations='{"query":"mutation($file: Upload!, $target: String!) { imageUploader(file: $file, target: $target) }","variables":{"file":null, "target":"members"}}' \
  -F map='{ "0": ["variables.file"] }' \
  -F 0=@/path/to/image.jpg
```

#### Property
- Mutation `createProperty(input: PropertyInput): Property` — RolesGuard(AGENT)
- Query `getProperty(propertyId: String!): Property` — WithoutGuard
- Mutation `updateProperty(input: PropertyUpdate): Property` — RolesGuard(AGENT)
- Query `getProperties(input: PropertiesInquiry): Properties` — WithoutGuard
- Query `getFavorites(input: OrdinaryInquiry): Properties` — AuthGuard
- Query `getAgentProperties(input: AgentPropertiesInquiry): Properties` — RolesGuard(AGENT)
- Query `getVisited(input: OrdinaryInquiry): Properties` — AuthGuard
- Mutation `likeTargetProperty(propertyId: String!): Property` — AuthGuard
- Query `getAllPropertiesByAdmin(input: AllPropertiesInquiry): Properties` — RolesGuard(ADMIN)
- Mutation `updatePropertyByAdmin(input: PropertyUpdate): Property` — RolesGuard(ADMIN)
- Mutation `removePropertyByAdmin(propertyId: String!): Property` — RolesGuard(ADMIN)

Examples:
```graphql
mutation CreateProperty {
  createProperty(
    input: {
      propertyType: VILLA
      propertyLocation: JEJU
      propertyAddress: "123 Beach Rd"
      propertyTitle: "Cozy Villa"
      propertyPrice: 350000
      propertySquare: 120
      propertyBeds: 3
      propertyRooms: 4
      propertyImages: ["/uploads/properties/img1.jpg"]
      propertyBathroom: 2
      propertyBreakfast: true
      propertyCancellation: false
    }
  ) { _id propertyTitle propertyLocation propertyPrice }
}
```
```graphql
query SearchProperties {
  getProperties(
    input: {
      page: 1
      limit: 20
      sort: createdAt
      direction: DESC
      search: {
        locationList: [SEOUL, JEJU]
        typeList: [VILLA]
        roomsList: [3,4]
        options: ["propertyBreakfast"]
        pricesRange: { start: 100000, end: 400000 }
        squaresRange: { start: 50, end: 200 }
        text: "cozy"
      }
    }
  ) {
    list { _id propertyTitle propertyLocation propertyPrice meLiked { myFavorite } }
    metaCounter { total }
  }
}
```

#### Comment
- Mutation `createComment(input: CommentInput): Comment` — AuthGuard
- Query `updateComment(input: CommentUpdate): Comment` — AuthGuard
- Query `getComments(input: CommentsInquiry): Comments` — WithoutGuard
- Mutation `removeCommentByAdmin(commentId: String!): Comment` — RolesGuard(ADMIN)

Example:
```graphql
mutation AddComment {
  createComment(input: { commentGroup: PROPERTY, commentContent: "Nice place!", commentRefId: "<propertyId>" }) {
    _id commentContent memberId
  }
}
```

#### Follow
- Mutation `subscribe(input: String!): Follower` — AuthGuard (input is followingId)
- Mutation `unsubscribe(input: String!): Follower` — AuthGuard (input is followingId)
- Query `getMemberFollowings(input: FollowInquiry): Followings` — WithoutGuard
- Query `getMemberFollowers(input: FollowInquiry): Followers` — WithoutGuard

Examples:
```graphql
mutation FollowMember { subscribe(input: "<memberId>") { _id followingId followerId } }
```
```graphql
query Followers {
  getMemberFollowers(input: { page: 1, limit: 10, search: { followingId: "<memberId>" } }) {
    list { _id followerData { _id memberNick } }
    metaCounter { total }
  }
}
```

#### Board Article
- Mutation `createBoardArticle(input: BoardArticleInput): BoardArticle` — AuthGuard
- Query `getBoardArticle(articleId: String!): BoardArticle` — WithoutGuard
- Mutation `updateBoardArticle(input: BoardArticleUpdate): BoardArticle` — AuthGuard
- Query `getBoardArticles(input: BoardArticlesInquiry): BoardArticles` — WithoutGuard
- Mutation `likeTargetBoardArticle(articleId: String!): BoardArticle` — AuthGuard
- Query `getAllBoardArticlesByAdmin(input: AllBoardArticlesInquiry): BoardArticles` — RolesGuard(ADMIN)
- Mutation `updateBoardArticlesByAdmin(input: BoardArticleUpdate): BoardArticle` — RolesGuard(ADMIN)
- Mutation `removeBoardArticlesByAdmin(articleId: String!): BoardArticle` — RolesGuard(ADMIN)

Example:
```graphql
query Articles {
  getBoardArticles(
    input: { page: 1, limit: 10, sort: createdAt, direction: DESC, search: { articleCategory: NEWS, text: "market" } }
  ) { list { _id articleTitle articleLikes } metaCounter { total } }
}
```

### WebSocket Gateway
- Transport: `websocket` (Nest `@nestjs/websockets` with `ws` adapter)
- URL: `ws://localhost:3000?token=<JWT>` (token is optional; when omitted, client is treated as Guest)
- Events:
  - Incoming from client:
    - `message`: send plain text. Server augments with authenticated member data (if available)
  - Outgoing from server:
    - `info`: `{ event: "info", totalClients: number, memberData?: Member, action: "joined"|"left" }`
    - `message`: `{ event: "message", text: string, memberData?: Member }`
    - `getMessages`: `{ event: "getMessages", list: Array<{ event: "message", text: string, memberData?: Member }> }` (sent on connect)

Example (Node `ws`):
```js
import WebSocket from 'ws';
const ws = new WebSocket('ws://localhost:3000?token=YOUR_JWT');
ws.on('open', () => ws.send('Hello everyone!'));
ws.on('message', (data) => console.log(JSON.parse(data.toString())));
```

### Data Types (DTOs)
Key input and output types are defined under `apps/booking/src/libs/dto/*`. Highlights:
- Member: `MemberInput`, `LoginInput`, `MembersInquiry`, `Member`, `Members`
- Property: `PropertyInput`, `PropertyUpdate`, `PropertiesInquiry`, `AgentPropertiesInquiry`, `AllPropertiesInquiry`, `OrdinaryInquiry`, `Property`, `Properties`
- Comment: `CommentInput`, `CommentUpdate`, `CommentsInquiry`, `Comment`, `Comments`
- Follow: `FollowInquiry`, `Following`, `Follower`, `Followings`, `Followers`
- Board Article: `BoardArticleInput`, `BoardArticleUpdate`, `BoardArticlesInquiry`, `AllBoardArticlesInquiry`, `BoardArticle`, `BoardArticles`

### Enums
- Member: `MemberType { USER, AGENT, ADMIN }`, `MemberStatus { ACTIVE, BLOCK, DELETE }`, `MemberAuthType { PHONE, EMAIL, TELEGRAM }`
- Property: `PropertyType { HOTEL, PENTHOUSE, VILLA }`, `PropertyStatus { HOLD, ACTIVE, SOLD, DELETE }`, `PropertyLocation { SEOUL, BUSAN, INCHEON, DAEGU, GYEONGJU, GWANGJU, CHONJU, DAEJON, JEJU }`
- Comment: `CommentStatus { ACTIVE, DELETE }`, `CommentGroup { MEMBER, ARTICLE, PROPERTY }`
- Like: `LikeGroup { MEMBER, PROPERTY, ARTICLE }`
- Board Article: `BoardArticleCategory { FREE, RECOMMEND, NEWS, HUMOR }`, `BoardArticleStatus { ACTIVE, DELETE }`
- View: `ViewGroup { MEMBER, ARTICLE, PROPERTY }`
- Common: `Direction { ASC, DESC }`

### Error format (GraphQL)
Errors are formatted globally to include `code` and `message` fields.
Example response:
```json
{
  "errors": [
    {
      "message": "Please login first!",
      "extensions": { "code": "UNAUTHENTICATED" }
    }
  ],
  "data": null
}
```

### Modules and Components
`ComponentsModule` bundles domain modules:
- `MemberModule`, `AuthModule`, `PropertyModule`, `LikeModule`, `ViewModule`, `CommentModule`, `FollowModule`, `BoardArticleModule`

### Batch Jobs (booking-batch app)
- `BATCH_ROLLBACK` — cron: `0 * * * *` (hourly at minute 0)
- `BATCH_TOP_PROPERTIES` — cron: `20 * * * * *` (every minute at second 20)
- `BATCH_TOP_AGENTS` — cron: `40 * * * * *` (every minute at second 40)

These are internal scheduled tasks; no public HTTP endpoints.

### Web Security & Notes
- Always include `Authorization` header for operations guarded by `AuthGuard` or `RolesGuard`.
- Some resolvers accept string IDs and internally coerce them to MongoDB `ObjectId`.
- File uploads allow only specific mime types: `image/png`, `image/jpg`, `image/jpeg`, `image/webp`, `image/avif`.