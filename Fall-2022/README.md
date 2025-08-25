# Fall-2022 (React TypeScript + .NET)

This version of the Good Driver Incentive Program uses:
- **Frontend**: React 18+ with TypeScript and modern React features
- **Backend**: ASP.NET Core Web API with C# 12
- **Database**: MySQL with Entity Framework Core
- **Authentication**: JWT Bearer tokens

## Technology Stack

### Frontend (React + TypeScript)
- React 18+ with TypeScript
- Modern React patterns (hooks, functional components)
- Material-UI or Styled Components for UI
- Axios for HTTP client
- React Router for navigation
- State management with React hooks/Context API

### Backend (.NET Web API)
- ASP.NET Core 8.0 Web API
- Entity Framework Core for ORM
- JWT Bearer authentication
- MySQL database provider
- Dependency injection
- RESTful API design

## Prerequisites

- Node.js 18+ and npm
- .NET 8.0 SDK
- MySQL 8.0+

## Setup Instructions

### Backend Setup (.NET)
```bash
cd dotnet-server
dotnet restore
dotnet ef database update  # After setting up Entity Framework migrations
dotnet run
```
Backend runs on https://localhost:5001 (HTTPS) and http://localhost:5000 (HTTP)

### Frontend Setup (React + TypeScript)
```bash
cd react-client
npm install
npm start
```
Frontend runs on http://localhost:3000

## Project Structure

```
Fall-2022/
├── react-client/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service calls
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
└── dotnet-server/         # .NET Core Web API backend
    ├── Controllers/       # API controllers
    ├── Models/           # Data models and DTOs
    ├── Services/         # Business logic services
    ├── Data/             # Entity Framework context and models
    ├── Program.cs        # Application entry point
    └── appsettings.json  # Configuration
```

## Development Notes

This implementation provides the same core functionality as the original Node.js/React version but leverages:
- TypeScript for enhanced type safety across the entire frontend
- .NET's robust framework with built-in dependency injection and middleware
- Entity Framework Core for type-safe database operations
- Modern React patterns with hooks and functional components
- Strong typing throughout the entire application stack