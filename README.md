# Good Driver Incentive Program

A comprehensive web application that provides a point-based incentive system for drivers, sponsored by organizations. Drivers can earn points for good driving behavior and redeem them for rewards through an integrated catalog system.

## Features

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

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: Session-based with encrypted passwords
- **Email**: Nodemailer with Gmail
- **External API**: Etsy API for product catalog
- **Security**: Input sanitization, parameterized queries

### Frontend
- **Framework**: React 17
- **Styling**: RSuite UI components, CSS
- **Routing**: React Router DOM
- **State Management**: React hooks
- **HTTP Client**: Axios (built into React)

### Development Tools
- **Testing**: Jest
- **Package Management**: npm
- **Environment Configuration**: dotenv

## Project Structure

```
Good-Driver-Incentive-Program/
├── Javascript-Code/
│   ├── Node-Server/              # Backend API server
│   │   ├── config/               # Configuration files
│   │   ├── endpoints/            # API route handlers
│   │   ├── logs/                 # Logging functionality
│   │   ├── services/             # Business logic services
│   │   ├── utils/                # Utility functions
│   │   ├── index.js              # Main server file
│   │   └── package.json          # Backend dependencies
│   ├── react-client/             # Frontend React application
│   │   ├── public/               # Static assets
│   │   ├── src/                  # React source code
│   │   │   ├── components/       # Reusable components
│   │   │   ├── pages/            # Page components
│   │   │   └── App.js            # Main app component
│   │   └── package.json          # Frontend dependencies
│   ├── database_init.sql         # Database schema
│   └── database_schema.md        # Database documentation
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites
- Node.js 14+ and npm
- MySQL 5.7+ or 8.0+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/pattygcoding/Good-Driver-Incentive-Program.git
cd Good-Driver-Incentive-Program
```

### 2. Database Setup

#### Create Database
```sql
-- Connect to your MySQL server and create the database
CREATE DATABASE good_driver_incentive;
```

#### Initialize Schema
```bash
# Run the database initialization script
mysql -u your_username -p good_driver_incentive < Javascript-Code/database_init.sql
```

### 3. Backend Setup
```bash
cd Javascript-Code/Node-Server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

#### Environment Configuration
Edit the `.env` file with your settings:

```env
# Application Environment
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_PORT=3306
DB_NAME=good_driver_incentive

# Server Configuration
PORT=4000

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Etsy API (for catalog integration)
ETSY_API_KEY=your_etsy_api_key

# Security
SESSION_SECRET=your_secure_session_secret_here
ENCRYPTION_KEY=your_encryption_key_here
```

#### Start Backend Server
```bash
npm start
```

The backend server will run on `http://localhost:4000`

### 4. Frontend Setup
```bash
cd ../react-client

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

### 5. Production Deployment

#### Backend Production
```bash
cd Javascript-Code/Node-Server

# Set production environment
export NODE_ENV=production

# Install production dependencies only
npm ci --only=production

# Start with PM2 (recommended)
npm install -g pm2
pm2 start index.js --name "driver-rewards-api"
```

#### Frontend Production
```bash
cd Javascript-Code/react-client

# Build production bundle
npm run build

# Serve with a web server (nginx, apache, or serve)
npm install -g serve
serve -s build -l 3000
```

## API Documentation

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

The application uses the following main tables:

- **USER**: User accounts (drivers, sponsors, admins)
- **SPONSOR_ORG**: Sponsor organization details
- **USER_SPONSOR_REL**: Links users to sponsor organizations
- **APPLICATION**: Driver applications to join sponsors
- **SPONSOR_CATALOG**: Catalog items per sponsor
- **ORDER**: Customer orders
- **ORDER_ITEMS**: Individual order items
- **LOGIN_ATTEMPTS**: Security logging
- **RESET_CODE**: Password reset tokens

See `Javascript-Code/database_schema.md` for detailed schema documentation.

## Default Accounts

The system includes default account codes:
- `0000`: Admin user creation
- `1111`: New sponsor organization
- `1730`: Special sponsor role

## Security Features

- Password encryption using AES encryption
- SQL injection prevention with parameterized queries
- Input sanitization and validation
- Session-based authentication
- Login attempt logging
- Password reset with time-limited tokens

## Testing

### Backend Tests
```bash
cd Javascript-Code/Node-Server
npm test
```

### Frontend Tests
```bash
cd Javascript-Code/react-client
npm test
```

## Development

### Adding New Features
1. Create new endpoint files in `Javascript-Code/Node-Server/endpoints/`
2. Add corresponding React components in `Javascript-Code/react-client/src/`
3. Update database schema if needed
4. Add tests for new functionality

### Code Style
- Use consistent indentation (2 spaces)
- Include error handling for all database operations
- Validate all user inputs
- Use parameterized queries for database operations
- Follow React hooks patterns for frontend components

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