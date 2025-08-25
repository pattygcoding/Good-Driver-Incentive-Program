# Fall-2021 (Node.js + React)

This version of the Good Driver Incentive Program uses:
- **Frontend**: React 17 with JavaScript and RSuite UI components
- **Backend**: Node.js with Express.js
- **Database**: MySQL with raw SQL queries
- **Session Management**: Express sessions

## Technology Stack

### Frontend (React)
- React 17 with JavaScript
- RSuite UI component library
- React Router DOM for navigation
- Axios for HTTP requests (built into React)
- CSS for custom styling

### Backend (Node.js)
- Node.js with Express.js framework
- MySQL with raw SQL queries and parameterized statements
- Express sessions for authentication
- Nodemailer for email functionality
- Crypto-js for password encryption
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js 14+ and npm
- MySQL 5.7+ or 8.0+

## Setup Instructions

### Backend Setup
Navigate to the Node-Server directory and run:
```bash
npm install
npm start
```
Backend runs on http://localhost:4000

### Frontend Setup
Navigate to the react-client directory and run:
```bash
npm install
npm start
```
Frontend runs on http://localhost:3000

In your browser, go to [http://localhost:3000](http://localhost:3000) to view the React application

## Project Structure

```
Fall-2021/
├── Node-Server/            # Node.js Express backend
│   ├── config/            # Configuration files
│   ├── endpoints/         # API route handlers
│   ├── logs/              # Logging functionality
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   ├── index.js           # Main server file
│   └── package.json       # Backend dependencies
├── react-client/          # React frontend application
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json       # Frontend dependencies
├── database_init.sql      # Database schema
└── database_schema.md     # Database documentation
```

## Development Notes

This is the original implementation that provides:
- Traditional server-side session management
- Direct SQL queries with parameterized statements for security
- RSuite component library for rapid UI development
- Express.js middleware for request handling
- Nodemailer integration for email notifications
- Comprehensive logging system