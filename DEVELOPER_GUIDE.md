# Booking Platform Developer Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### Environment Setup

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd booking-platform
npm install
```

2. **Environment Variables**
Create a `.env` file in the root directory:
```env
# Database
MONGO_URL=mongodb://localhost:27017/booking-platform
DB_NAME=booking-platform

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT_API=3005
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=15000000
MAX_FILES=10
```

3. **Start Development Server**
```bash
# Start main application
npm run start:dev

# Start batch processing service
npm run start:dev:batch
```

4. **Access Services**
- **API**: http://localhost:3005
- **GraphQL Playground**: http://localhost:3005/graphql
- **File Uploads**: http://localhost:3005/uploads/

## Project Structure

```
booking-platform/
├── apps/
│   ├── booking/                 # Main application
│   │   ├── src/
│   │   │   ├── components/      # Business logic modules
│   │   │   │   ├── auth/        # Authentication & authorization
│   │   │   │   ├── member/      # User management
│   │   │   │   ├── property/    # Property management
│   │   │   │   ├── comment/     # Comment system
│   │   │   │   ├── follow/      # Follow/unfollow functionality
│   │   │   │   ├── like/        # Like system
│   │   │   │   ├── view/        # View tracking
│   │   │   │   └── board-article/ # Blog/article system
│   │   │   ├── libs/            # Shared utilities
│   │   │   │   ├── dto/         # Data Transfer Objects
│   │   │   │   ├── enums/       # Enumeration types
│   │   │   │   ├── types/       # TypeScript type definitions
│   │   │   │   └── interceptor/ # Request/response interceptors
│   │   │   ├── schemas/         # MongoDB schemas
│   │   │   ├── socket/          # WebSocket gateway
│   │   │   └── database/        # Database configuration
│   │   └── test/                # E2E tests
│   └── booking-batch/           # Batch processing service
│       └── src/
├── uploads/                     # File upload directory
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## Development Workflow

### Creating a New Component

1. **Generate Module Structure**
```bash
# Generate module, service, and resolver
nest g module components/new-feature
nest g service components/new-feature
nest g resolver components/new-feature
```

2. **Create Data Models**
```typescript
// schemas/NewFeature.model.ts
import { Schema } from 'mongoose';

const NewFeatureSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
}, { timestamps: true });

export default NewFeatureSchema;
```

3. **Define DTOs**
```typescript
// libs/dto/new-feature/new-feature.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NewFeature {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  createdAt: Date;
}
```

4. **Input DTOs**
```typescript
// libs/dto/new-feature/new-feature.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class NewFeatureInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;
}
```

5. **Implement Service**
```typescript
// components/new-feature/new-feature.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewFeature } from '../../libs/dto/new-feature/new-feature';
import { NewFeatureInput } from '../../libs/dto/new-feature/new-feature.input';

@Injectable()
export class NewFeatureService {
  constructor(
    @InjectModel('NewFeature') private readonly newFeatureModel: Model<NewFeature>
  ) {}

  async create(input: NewFeatureInput, memberId: string): Promise<NewFeature> {
    const newFeature = new this.newFeatureModel({
      ...input,
      memberId
    });
    return await newFeature.save();
  }

  async findAll(): Promise<NewFeature[]> {
    return await this.newFeatureModel.find().exec();
  }
}
```

6. **Create Resolver**
```typescript
// components/new-feature/new-feature.resolver.ts
import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { NewFeatureService } from './new-feature.service';
import { NewFeature } from '../../libs/dto/new-feature/new-feature';
import { NewFeatureInput } from '../../libs/dto/new-feature/new-feature.input';

@Resolver()
export class NewFeatureResolver {
  constructor(private readonly newFeatureService: NewFeatureService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => NewFeature)
  async createNewFeature(
    @Args('input') input: NewFeatureInput,
    @AuthMember('_id') memberId: string
  ): Promise<NewFeature> {
    return await this.newFeatureService.create(input, memberId);
  }

  @Query(() => [NewFeature])
  async getNewFeatures(): Promise<NewFeature[]> {
    return await this.newFeatureService.findAll();
  }
}
```

### Adding Authentication Guards

```typescript
// Use different guards based on requirements

// Require authentication
@UseGuards(AuthGuard)

// Require specific role
@Roles(MemberType.AGENT)
@UseGuards(RolesGuard)

// Optional authentication (user data available if logged in)
@UseGuards(WithoutGuard)

// Get authenticated user data
@AuthMember('_id') memberId: string
@AuthMember() member: Member
```

### Working with File Uploads

```typescript
// In resolver
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Mutation(() => String)
async uploadImage(
  @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload
): Promise<string> {
  const { createReadStream, filename, mimetype } = await file;
  
  // Validate file type
  if (!validMimeTypes.includes(mimetype)) {
    throw new Error('Invalid file type');
  }
  
  // Generate unique filename
  const imageName = getSerialForImage(filename);
  const stream = createReadStream();
  const path = `./uploads/${imageName}`;
  
  // Save file
  await new Promise((resolve, reject) => {
    stream
      .pipe(createWriteStream(path))
      .on('finish', resolve)
      .on('error', reject);
  });
  
  return imageName;
}
```

## Testing

### Unit Tests

```typescript
// Example: member.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;
  let mockMemberModel: any;

  beforeEach(async () => {
    mockMemberModel = {
      new: jest.fn(),
      constructor: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getModelToken('Member'),
          useValue: mockMemberModel,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a member', async () => {
    const memberInput = {
      memberNick: 'testuser',
      memberPhone: '+1234567890',
      memberPassword: 'password',
    };

    mockMemberModel.create.mockResolvedValue(memberInput);
    const result = await service.signup(memberInput);
    expect(result).toEqual(memberInput);
  });
});
```

### E2E Tests

```typescript
// Example: app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/graphql (POST) - signup mutation', () => {
    const mutation = `
      mutation {
        signup(input: {
          memberNick: "testuser"
          memberPhone: "+1234567890"
          memberPassword: "password123"
        }) {
          _id
          memberNick
          accessToken
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.signup).toBeDefined();
        expect(res.body.data.signup.memberNick).toBe('testuser');
      });
  });
});
```

### Running Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start:prod

# Start batch service
npm run start:prod:batch
```

### Docker Deployment

```dockerfile
# Dockerfile (already included)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3005

CMD ["npm", "run", "start:prod"]
```

```bash
# Build and run with Docker
docker build -t booking-platform .
docker run -p 3005:3005 booking-platform

# Or use docker-compose
docker-compose up -d
```

### Environment Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  booking-api:
    build: .
    ports:
      - "3005:3005"
    environment:
      - NODE_ENV=production
      - MONGO_URL=mongodb://mongo:27017/booking
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo_data:
```

## Best Practices

### Code Organization

1. **Use consistent naming conventions**
   - PascalCase for classes, interfaces, and enums
   - camelCase for variables and functions
   - kebab-case for file names

2. **Follow NestJS architectural patterns**
   - Keep controllers thin, business logic in services
   - Use dependency injection properly
   - Implement proper error handling

3. **Database Best Practices**
   - Use proper indexing for frequently queried fields
   - Implement soft deletes where appropriate
   - Use transactions for multi-document operations

### Security

1. **Authentication & Authorization**
```typescript
// Always validate JWT tokens
@UseGuards(AuthGuard)

// Check user permissions
@Roles(MemberType.ADMIN)
@UseGuards(RolesGuard)

// Validate input data
@IsNotEmpty()
@IsString()
@Length(3, 50)
memberNick: string;
```

2. **Input Validation**
```typescript
// Use class-validator decorators
@InputType()
export class CreatePropertyInput {
  @Field()
  @IsNotEmpty()
  @Length(5, 100)
  propertyTitle: string;

  @Field()
  @IsNumber()
  @Min(0)
  propertyPrice: number;

  @Field()
  @IsEnum(PropertyType)
  propertyType: PropertyType;
}
```

3. **Error Handling**
```typescript
// Use appropriate HTTP status codes
try {
  return await this.service.create(input);
} catch (error) {
  if (error.code === 11000) {
    throw new ConflictException('Resource already exists');
  }
  throw new InternalServerErrorException('Server error');
}
```

### Performance

1. **Database Optimization**
```typescript
// Use proper aggregation for complex queries
const pipeline = [
  { $match: { propertyStatus: PropertyStatus.ACTIVE } },
  { $lookup: { from: 'members', localField: 'memberId', foreignField: '_id', as: 'memberData' } },
  { $sort: { propertyRank: -1 } },
  { $limit: 10 }
];

return await this.propertyModel.aggregate(pipeline);
```

2. **Caching**
```typescript
// Implement caching for frequently accessed data
@Injectable()
export class PropertyService {
  private cache = new Map();

  async getPopularProperties(): Promise<Property[]> {
    const cacheKey = 'popular_properties';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const properties = await this.findPopularProperties();
    this.cache.set(cacheKey, properties);
    
    // Set expiration
    setTimeout(() => this.cache.delete(cacheKey), 300000); // 5 minutes
    
    return properties;
  }
}
```

## Troubleshooting

### Common Issues

1. **GraphQL Schema Conflicts**
```
Error: Schema must contain uniquely named types but contains multiple types named "X"
```
**Solution**: Ensure all GraphQL types have unique names across modules.

2. **MongoDB Connection Issues**
```
MongooseError: Operation `members.findOne()` buffering timed out
```
**Solution**: Check MongoDB connection string and network connectivity.

3. **JWT Token Validation Errors**
```
JsonWebTokenError: invalid token
```
**Solution**: Verify JWT secret configuration and token format.

4. **File Upload Issues**
```
Error: Cannot read property 'createReadStream' of undefined
```
**Solution**: Ensure GraphQL upload middleware is properly configured.

### Debug Mode

```bash
# Run with debug logging
npm run start:debug

# View detailed error logs
NODE_ENV=development npm run start:dev
```

### Logging

```typescript
// Add comprehensive logging
import { Logger } from '@nestjs/common';

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name);

  async createProperty(input: PropertyInput): Promise<Property> {
    this.logger.log(`Creating property: ${input.propertyTitle}`);
    
    try {
      const property = await this.propertyModel.create(input);
      this.logger.log(`Property created successfully: ${property._id}`);
      return property;
    } catch (error) {
      this.logger.error(`Failed to create property: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### Performance Monitoring

```typescript
// Add performance interceptors
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const method = context.switchToHttp().getRequest().method;
    const url = context.switchToHttp().getRequest().url;
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`${method} ${url} - ${duration}ms`);
      })
    );
  }
}
```

---

This guide provides a comprehensive foundation for developing with the Booking Platform. For additional questions or contributions, please refer to the project repository or contact the development team.