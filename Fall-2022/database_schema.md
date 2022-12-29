# Database Schema Documentation

This document describes the database schema for the Good Driver Incentive Program.

## Tables

### USER
Stores user information for all types of users (drivers, sponsors, admins).

| Column | Type | Description |
|--------|------|-------------|
| uID | INT PRIMARY KEY AUTO_INCREMENT | Unique user identifier |
| fname | VARCHAR(50) | First name |
| lname | VARCHAR(50) | Last name |
| username | VARCHAR(50) UNIQUE | Username for login |
| password | VARCHAR(255) | Encrypted password |
| email | VARCHAR(100) UNIQUE | Email address |
| phone | VARCHAR(15) | Phone number |
| usertype | INT | User type (0=admin, 1=driver, 2=sponsor) |
| status | BOOLEAN | Account active status |

### SPONSOR_ORG
Stores sponsor organization information.

| Column | Type | Description |
|--------|------|-------------|
| sponsorID | INT PRIMARY KEY AUTO_INCREMENT | Unique sponsor identifier |
| orgName | VARCHAR(100) | Organization name |
| email | VARCHAR(100) | Organization email |
| street | VARCHAR(100) | Street address |
| city | VARCHAR(50) | City |
| state | VARCHAR(2) | State abbreviation |
| zip | VARCHAR(10) | ZIP code |
| pointsPerDollar | INT | Points earned per dollar spent |

### USER_SPONSOR_REL
Links users to sponsor organizations (many-to-many relationship).

| Column | Type | Description |
|--------|------|-------------|
| relID | INT PRIMARY KEY AUTO_INCREMENT | Unique relationship identifier |
| uID | INT | User ID (foreign key to USER.uID) |
| sponsorID | INT | Sponsor ID (foreign key to SPONSOR_ORG.sponsorID) |

### ACCOUNT_CODE
Stores account codes for joining organizations.

| Column | Type | Description |
|--------|------|-------------|
| codeID | INT PRIMARY KEY AUTO_INCREMENT | Unique code identifier |
| code | VARCHAR(10) | Account code |
| sponsorID | INT | Associated sponsor ID |

### APPLICATION
Tracks driver applications to join sponsor organizations.

| Column | Type | Description |
|--------|------|-------------|
| applicationsID | INT PRIMARY KEY AUTO_INCREMENT | Unique application identifier |
| uID | INT | User ID (foreign key to USER.uID) |
| sponsorID | INT | Sponsor ID (foreign key to SPONSOR_ORG.sponsorID) |
| status | INT | Application status (0=pending, 1=approved, 2=rejected) |
| date | DATE | Application date |

### SPONSOR_CATALOG
Links sponsor organizations to catalog items.

| Column | Type | Description |
|--------|------|-------------|
| catalogID | INT PRIMARY KEY AUTO_INCREMENT | Unique catalog entry identifier |
| listingId | INT | Etsy listing ID |
| sponsorID | INT | Sponsor ID (foreign key to SPONSOR_ORG.sponsorID) |

### CATALOG_IMAGES
Stores image URLs for catalog items.

| Column | Type | Description |
|--------|------|-------------|
| imageID | INT PRIMARY KEY AUTO_INCREMENT | Unique image identifier |
| link | VARCHAR(500) | Image URL |
| listingId | INT | Associated listing ID |

### ORDER
Tracks customer orders.

| Column | Type | Description |
|--------|------|-------------|
| orderID | INT PRIMARY KEY AUTO_INCREMENT | Unique order identifier |
| uID | INT | User ID (foreign key to USER.uID) |
| status | INT | Order status |
| total | DECIMAL(10,2) | Total order amount |
| date | DATE | Order date |
| sponsorID | INT | Sponsor ID (foreign key to SPONSOR_ORG.sponsorID) |

### ORDER_ITEMS
Individual items within orders.

| Column | Type | Description |
|--------|------|-------------|
| itemID | INT PRIMARY KEY AUTO_INCREMENT | Unique item identifier |
| listingId | INT | Etsy listing ID |
| orderID | INT | Order ID (foreign key to ORDER.orderID) |
| name | VARCHAR(200) | Item name |
| price | DECIMAL(10,2) | Item price |
| quantity | INT | Quantity ordered |

### LOGIN_ATTEMPTS
Logs user login attempts for security tracking.

| Column | Type | Description |
|--------|------|-------------|
| attemptID | INT PRIMARY KEY AUTO_INCREMENT | Unique attempt identifier |
| date | DATETIME | Login attempt timestamp |
| username | VARCHAR(50) | Username attempted |
| success | BOOLEAN | Whether login was successful |
| uID | INT | User ID if login successful |

### PASSWORD_CHANGES
Tracks password changes for security auditing.

| Column | Type | Description |
|--------|------|-------------|
| changeID | INT PRIMARY KEY AUTO_INCREMENT | Unique change identifier |
| uId | INT | User ID (foreign key to USER.uID) |
| changeType | VARCHAR(20) | Type of change (e.g., 'RESET') |
| timestamp | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | When change occurred |

### RESET_CODE
Temporary codes for password resets.

| Column | Type | Description |
|--------|------|-------------|
| codeID | INT PRIMARY KEY AUTO_INCREMENT | Unique code identifier |
| code | VARCHAR(50) | Reset code |
| email | VARCHAR(100) | Associated email |
| time | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Code generation time |

## Relationships

- USER has many USER_SPONSOR_REL (users can belong to multiple sponsors)
- SPONSOR_ORG has many USER_SPONSOR_REL (sponsors can have multiple users)
- SPONSOR_ORG has many APPLICATION (sponsors receive applications)
- USER has many APPLICATION (users can apply to multiple sponsors)
- SPONSOR_ORG has many SPONSOR_CATALOG (sponsors can have multiple catalog items)
- USER has many ORDER (users can place multiple orders)
- ORDER has many ORDER_ITEMS (orders can contain multiple items)
- USER has many LOGIN_ATTEMPTS (tracks all login attempts per user)
- USER has many PASSWORD_CHANGES (tracks password history per user)

## Initial Data

The system uses specific account codes for different user types:
- `0000`: Admin user
- `1111`: New sponsor organization
- `1730`: Special sponsor role
- Other codes: Regular driver accounts linked to specific sponsors