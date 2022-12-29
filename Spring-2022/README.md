# Spring-2022 (Angular + Spring Boot)

This version of the Good Driver Incentive Program uses:
- **Frontend**: Angular 17+ with TypeScript and SCSS
- **Backend**: Spring Boot 3.2+ with Java 17
- **Database**: MySQL 8.0+
- **Build Tools**: Maven (backend), npm/Angular CLI (frontend)

## Technology Stack

### Frontend (Angular)
- Angular 17+
- TypeScript
- Angular Material UI
- RxJS for reactive programming
- Angular Router for navigation
- Angular Forms for form handling

### Backend (Spring Boot)
- Spring Boot 3.2+
- Spring Security for authentication
- Spring Data JPA for database operations  
- Spring Mail for email notifications
- MySQL Connector for database connectivity
- Maven for dependency management

## Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- MySQL 8.0+

## Setup Instructions

### Backend Setup
```bash
cd spring-boot-server
mvn clean install
mvn spring-boot:run
```
Backend runs on http://localhost:8080

### Frontend Setup  
```bash
cd angular-client
npm install
ng serve
```
Frontend runs on http://localhost:4200

## Project Structure

```
Spring-2022/
├── angular-client/          # Angular frontend application
│   ├── src/
│   │   ├── app/            # Angular components and services
│   │   ├── assets/         # Static assets
│   │   └── styles.scss     # Global styles
│   ├── package.json        # Frontend dependencies
│   └── angular.json        # Angular configuration
└── spring-boot-server/     # Spring Boot backend
    ├── src/main/java/      # Java source code
    ├── src/main/resources/ # Configuration files
    ├── src/test/           # Test files
    └── pom.xml             # Maven configuration
```

## Development Notes

This implementation provides the same core functionality as the original Node.js/React version but leverages:
- Angular's component-based architecture and TypeScript for type safety
- Spring Boot's comprehensive framework with built-in security and data access
- Maven for robust dependency management and build processes
- Modern Java features and best practices