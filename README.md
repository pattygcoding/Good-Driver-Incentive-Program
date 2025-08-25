# Good Driver Incentive Program

![Technologies](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

A comprehensive web application that provides a point-based incentive system for drivers, sponsored by organizations. Drivers can earn points for good driving behavior and redeem them for rewards through an integrated catalog system.

This project has been implemented using multiple technology stacks across different academic semesters to demonstrate various modern web development approaches.

## Available Implementations

### 🍂 Fall-2021 - Node.js + React
**Original Implementation**
- **Frontend**: React 17, JavaScript, RSuite UI
- **Backend**: Node.js, Express.js, Raw MySQL queries
- **Authentication**: Express sessions
- **Location**: `Fall-2021/`

### 🌸 Spring-2022 - Angular + Spring Boot
**Enterprise Java Implementation**  
- **Frontend**: Angular 17+, TypeScript, Angular Material
- **Backend**: Spring Boot 3.2+, Java 17, JPA/Hibernate
- **Authentication**: JWT tokens
- **Location**: `Spring-2022/`

### 🍁 Fall-2022 - React TypeScript + .NET
**Microsoft Stack Implementation**
- **Frontend**: React 18+, TypeScript, Modern React patterns
- **Backend**: ASP.NET Core 8.0, C# 12, Entity Framework Core
- **Authentication**: JWT Bearer tokens  
- **Location**: `Fall-2022/`

## Core Features

All implementations provide the same comprehensive functionality:

### User Roles
- **Drivers**: Earn points, apply to sponsor organizations, browse and purchase catalog items
- **Sponsors**: Manage driver applications, configure point systems, manage catalog items
- **Admins**: Full system administration, user management, reporting

### Core Functionality
- User authentication and authorization
- Role-based access control
- Point-based reward system
- Organization management
- Etsy API integration for catalog items
- Order management system
- Email notifications
- Comprehensive logging and reporting

## Technology Comparison

| Feature | Fall-2021 | Spring-2022 | Fall-2022 |
|---------|-----------|-------------|-----------|
| **Frontend Language** | JavaScript | TypeScript | TypeScript |
| **Frontend Framework** | React 17 | Angular 17+ | React 18+ |
| **UI Library** | RSuite | Angular Material | Material-UI/Styled |
| **Backend Language** | JavaScript | Java 17 | C# 12 |
| **Backend Framework** | Express.js | Spring Boot 3.2+ | ASP.NET Core 8.0 |
| **Database Access** | Raw SQL | JPA/Hibernate | Entity Framework Core |
| **Authentication** | Express Sessions | JWT | JWT Bearer |
| **Build Tools** | npm | Maven + npm | dotnet + npm |
| **Runtime** | Node.js | JVM | .NET Runtime |

## Quick Start Guide

Choose your preferred implementation:

### Fall-2021 (Node.js + React)
```bash
cd Fall-2021

# Backend
cd Node-Server && npm install && npm start

# Frontend (in new terminal)
cd ../react-client && npm install && npm start
```

### Spring-2022 (Angular + Spring Boot)  
```bash
cd Spring-2022

# Backend
cd spring-boot-server && mvn spring-boot:run

# Frontend (in new terminal)
cd ../angular-client && npm install && ng serve
```

### Fall-2022 (React + .NET)
```bash
cd Fall-2022

# Backend  
cd dotnet-server && dotnet run

# Frontend (in new terminal)
cd ../react-client && npm install && npm start
```

## Project Structure

```
Good-Driver-Incentive-Program/
├── Fall-2021/              # Node.js + React (Original)
│   ├── Node-Server/        # Express.js backend
│   ├── react-client/       # React frontend
│   ├── database_init.sql   # Database schema
│   └── database_schema.md  # Database documentation
├── Spring-2022/            # Angular + Spring Boot
│   ├── spring-boot-server/ # Spring Boot backend
│   └── angular-client/     # Angular frontend
├── Fall-2022/              # React + .NET
│   ├── dotnet-server/      # ASP.NET Core backend
│   └── react-client/       # React TypeScript frontend
└── README.md               # This file
```

## Installation & Setup

### Prerequisites
- **For all implementations**: MySQL 5.7+ or 8.0+, Git
- **Fall-2021**: Node.js 14+ and npm
- **Spring-2022**: Node.js 18+, npm, Java 17+, Maven 3.6+
- **Fall-2022**: Node.js 18+, npm, .NET 8.0 SDK

### Database Setup (Common for all implementations)

#### Create Database
```sql
-- Connect to your MySQL server and create the database
CREATE DATABASE good_driver_incentive;
```

#### Initialize Schema
```bash
# Use the schema from Fall-2021 (applies to all implementations)
mysql -u your_username -p good_driver_incentive < Fall-2021/database_init.sql
```

### Implementation-Specific Setup

Detailed setup instructions are available in each implementation's README:
- [Fall-2021 Setup](Fall-2021/README.md)
- [Spring-2022 Setup](Spring-2022/README.md)  
- [Fall-2022 Setup](Fall-2022/README.md)

## API Documentation

The API endpoints are consistent across all implementations, though the underlying technology differs:

### Authentication Endpoints
- `POST /signup-attempt` - Create new user account
- `POST /login-attempt` - User login
- `GET /logout` - User logout
- `POST /resetpass-attempt` - Password reset

### User Management
- `POST /add-user` - Admin: Create new user
- `POST /toggle-active` - Admin: Activate/deactivate user
- `POST /updateaccount` - Update user account information

### Organization Management
- `POST /neworganization-attempt` - Create new sponsor organization
- `POST /add-org` - Admin: Add organization
- `POST /update-org` - Update organization details
- `GET /organizations` - Get organization list
- `POST /addOrgApplication` - Driver: Apply to organization
- `GET /getApplications` - Sponsor: View applications

### Catalog & Orders
- `GET /catalog` - Browse catalog items
- `POST /addCatalogItem` - Add item to sponsor catalog
- `POST /create-order` - Place order
- `GET /getOrders` - View order history

### Points & Reporting
- `GET /points` - Get user points
- `POST /updatePoints` - Update user points
- `GET /reports` - Generate reports

## Database Schema

The database schema is shared across all implementations:

- **USER**: User accounts (drivers, sponsors, admins)
- **SPONSOR_ORG**: Sponsor organization details
- **USER_SPONSOR_REL**: Links users to sponsor organizations
- **APPLICATION**: Driver applications to join sponsors
- **SPONSOR_CATALOG**: Catalog items per sponsor
- **ORDER**: Customer orders
- **ORDER_ITEMS**: Individual order items
- **LOGIN_ATTEMPTS**: Security logging
- **RESET_CODE**: Password reset tokens

See `Fall-2021/database_schema.md` for detailed schema documentation.

## Default Accounts

All implementations include default account codes:
- `0000`: Admin user creation
- `1111`: New sponsor organization
- `1730`: Special sponsor role

## Security Features

All implementations include:
- Password encryption (AES encryption or hashing depending on implementation)
- SQL injection prevention with parameterized queries or ORM
- Input sanitization and validation
- Authentication (sessions or JWT)
- Login attempt logging
- Password reset with time-limited tokens

## Testing

### Fall-2021 (Node.js + React)
```bash
# Backend Tests
cd Fall-2021/Node-Server && npm test

# Frontend Tests  
cd Fall-2021/react-client && npm test
```

### Spring-2022 (Angular + Spring Boot)
```bash
# Backend Tests
cd Spring-2022/spring-boot-server && mvn test

# Frontend Tests
cd Spring-2022/angular-client && ng test
```

### Fall-2022 (React + .NET)
```bash
# Backend Tests
cd Fall-2022/dotnet-server && dotnet test

# Frontend Tests
cd Fall-2022/react-client && npm test
```

## Development

### Adding New Features

The approach differs by implementation but generally follows these patterns:

**Fall-2021 (Node.js + React)**:
1. Create new endpoint files in `Fall-2021/Node-Server/endpoints/`
2. Add corresponding React components in `Fall-2021/react-client/src/`
3. Update database schema if needed
4. Add tests for new functionality

**Spring-2022 (Angular + Spring Boot)**:
1. Create new controllers in `Spring-2022/spring-boot-server/src/main/java/.../controllers/`
2. Add Angular components in `Spring-2022/angular-client/src/app/`
3. Update JPA entities and repositories as needed
4. Add tests for new functionality

**Fall-2022 (React + .NET)**:
1. Create new controllers in `Fall-2022/dotnet-server/Controllers/`
2. Add React TypeScript components in `Fall-2022/react-client/src/`
3. Update Entity Framework models as needed
4. Add tests for new functionality

### Code Style Guidelines

**All Implementations**:
- Use consistent indentation (2 spaces for JS/TS, 4 for Java/C#)
- Include comprehensive error handling
- Validate all user inputs
- Follow security best practices

**Specific Guidelines**:
- **Fall-2021**: Use parameterized queries, React hooks patterns
- **Spring-2022**: Follow Spring Boot conventions, use Angular best practices
- **Fall-2022**: Use Entity Framework patterns, follow .NET conventions

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists and schema is initialized

### Email Not Sending
- Verify Gmail credentials and app password
- Check email service configuration in `.env`
- Ensure Gmail account has "Less secure app access" enabled or use App Passwords

### Etsy API Issues
- Verify Etsy API key is valid
- Check API rate limits
- Ensure catalog items exist in Etsy

### Port Already in Use
```bash
# Find and kill process using port 4000
sudo lsof -t -i tcp:4000 | xargs kill -9

# Or use different ports
PORT=4001 npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the database schema documentation
3. Check console logs for error details
4. Open an issue on GitHub with detailed error information

## License

This project is licensed under the MIT License.