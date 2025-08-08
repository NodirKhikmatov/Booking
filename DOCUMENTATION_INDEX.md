# Booking Platform Documentation Index

## Overview

Welcome to the comprehensive documentation for the Booking Platform - a full-stack property booking application built with NestJS, GraphQL, MongoDB, and WebSocket support. This documentation provides everything you need to understand, develop, and maintain the platform.

## Documentation Structure

### 📖 [API Documentation](./API_DOCUMENTATION.md)
**Complete API reference for developers**
- GraphQL queries and mutations
- REST endpoints 
- WebSocket events
- Authentication flows
- Request/response examples
- Error handling
- Rate limiting

### 🔧 [Developer Guide](./DEVELOPER_GUIDE.md)
**Step-by-step development guide**
- Environment setup
- Project structure overview
- Development workflows
- Testing strategies
- Deployment instructions
- Best practices
- Troubleshooting

### 📋 [Schema Reference](./SCHEMA_REFERENCE.md)
**Complete data structure documentation**
- MongoDB schemas
- GraphQL types and inputs
- Enumerations
- Validation rules
- Database indexes
- Type definitions

## Quick Start

1. **New Developers**: Start with the [Developer Guide](./DEVELOPER_GUIDE.md) to set up your environment
2. **API Integration**: Use the [API Documentation](./API_DOCUMENTATION.md) for implementing features
3. **Data Modeling**: Reference [Schema Documentation](./SCHEMA_REFERENCE.md) for understanding data structures

## Key Features Documented

### 🏠 **Property Management**
- Property creation and management (Agents only)
- Property search and filtering
- Property views and likes
- Property status management
- Image upload and management

### 👥 **User Management**
- User registration and authentication
- Role-based access control (USER, AGENT, ADMIN)
- Profile management
- Follow/unfollow system
- User rankings and statistics

### 💬 **Social Features**
- Comment system on properties and articles
- Like system for content
- Follow system between users
- Real-time chat via WebSockets
- Activity tracking and views

### 📰 **Content Management**
- Board article system
- Article categories (FREE, HUMOR, QUESTION, REVIEW, NEWS)
- Article comments and likes
- Content moderation

### 🔄 **Batch Operations**
- Automated ranking calculations
- Data maintenance tasks
- Scheduled operations
- Performance optimization

## API Architecture

### **GraphQL (Primary)**
- Type-safe queries and mutations
- Real-time subscriptions
- Introspection support
- Comprehensive error handling

### **REST (Minimal)**
- File upload endpoints
- Health checks
- Static file serving

### **WebSocket**
- Real-time chat functionality
- Live user presence
- Instant notifications

## Technology Stack

| Category | Technology |
|----------|------------|
| **Backend Framework** | NestJS with TypeScript |
| **API Layer** | GraphQL with Apollo Server |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT with bcrypt |
| **Real-time** | WebSocket with Socket.IO |
| **File Upload** | GraphQL Upload |
| **Validation** | class-validator & class-transformer |
| **Testing** | Jest with Supertest |
| **Documentation** | Generated from code |

## Database Design

### **Collections**
- `members` - User accounts and profiles
- `properties` - Property listings and details
- `comments` - Comments on various content
- `board-articles` - Blog posts and articles
- `follows` - User follow relationships
- `likes` - Like relationships for content
- `views` - View tracking for analytics

### **Key Relationships**
- Members can create multiple properties (1:N)
- Members can follow other members (N:N)
- Members can like/comment on content (N:N)
- All content has view tracking for analytics

## Security Features

### **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control
- Password hashing with bcrypt
- Token expiration and refresh

### **Input Validation**
- Comprehensive input sanitization
- Type validation with decorators
- File upload validation
- Rate limiting protection

### **Data Protection**
- CORS configuration
- Request logging and monitoring
- Error message sanitization
- Sensitive data filtering

## Performance Optimizations

### **Database**
- Strategic indexing on frequently queried fields
- Aggregation pipelines for complex queries
- Connection pooling
- Query optimization

### **Caching**
- In-memory caching for frequently accessed data
- Static file caching
- GraphQL query result caching

### **File Handling**
- Optimized file upload with validation
- Static file serving with Express
- Image processing and optimization

## Development Guidelines

### **Code Quality**
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Comprehensive error handling
- Logging and monitoring

### **Testing Strategy**
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical flows
- Mocking external dependencies

### **Deployment**
- Docker containerization
- Environment-specific configurations
- Health checks and monitoring
- Graceful shutdown handling

## Getting Support

### **Documentation Issues**
If you find any issues with this documentation:
1. Check the relevant section thoroughly
2. Review the troubleshooting guide
3. Examine the example code provided
4. Contact the development team

### **Development Questions**
For development-related questions:
1. Start with the [Developer Guide](./DEVELOPER_GUIDE.md)
2. Check the [API Documentation](./API_DOCUMENTATION.md) for specific endpoints
3. Review the [Schema Reference](./SCHEMA_REFERENCE.md) for data structures
4. Use the GraphQL Playground for interactive testing

### **API Integration Help**
For API integration assistance:
1. Review the complete examples in the API documentation
2. Test endpoints in the GraphQL Playground
3. Check authentication requirements
4. Verify input validation requirements

## Version Information

| Component | Version | Notes |
|-----------|---------|-------|
| **Node.js** | 18+ | Required minimum version |
| **NestJS** | 11.x | Latest stable version |
| **GraphQL** | 16.x | Apollo Server 4.x |
| **MongoDB** | 6.x | With Mongoose 8.x |
| **TypeScript** | 5.x | Latest stable version |

## Contributing

When contributing to the platform:
1. Follow the established patterns in the codebase
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Follow the security best practices outlined
5. Ensure backward compatibility when possible

---

**Last Updated**: Generated automatically from codebase analysis
**Documentation Version**: 1.0.0
**Platform Version**: 0.0.1

For the most up-to-date information, refer to the individual documentation files and the codebase itself.