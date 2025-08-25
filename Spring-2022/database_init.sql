-- Good Driver Incentive Program Database Schema
-- Run this script to create the necessary tables

CREATE DATABASE IF NOT EXISTS good_driver_incentive;
USE good_driver_incentive;

-- User table for all user types
CREATE TABLE IF NOT EXISTS USER (
    uID INT PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    usertype INT NOT NULL DEFAULT 1, -- 0=admin, 1=driver, 2=sponsor
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sponsor organizations
CREATE TABLE IF NOT EXISTS SPONSOR_ORG (
    sponsorID INT PRIMARY KEY AUTO_INCREMENT,
    orgName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(2),
    zip VARCHAR(10),
    pointsPerDollar INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User-Sponsor relationships (many-to-many)
CREATE TABLE IF NOT EXISTS USER_SPONSOR_REL (
    relID INT PRIMARY KEY AUTO_INCREMENT,
    uID INT NOT NULL,
    sponsorID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uID) REFERENCES USER(uID) ON DELETE CASCADE,
    FOREIGN KEY (sponsorID) REFERENCES SPONSOR_ORG(sponsorID) ON DELETE CASCADE,
    UNIQUE KEY unique_user_sponsor (uID, sponsorID)
);

-- Account codes for joining organizations
CREATE TABLE IF NOT EXISTS ACCOUNT_CODE (
    codeID INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    sponsorID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sponsorID) REFERENCES SPONSOR_ORG(sponsorID) ON DELETE CASCADE
);

-- Driver applications to join sponsors
CREATE TABLE IF NOT EXISTS APPLICATION (
    applicationsID INT PRIMARY KEY AUTO_INCREMENT,
    uID INT NOT NULL,
    sponsorID INT NOT NULL,
    status INT DEFAULT 0, -- 0=pending, 1=approved, 2=rejected
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uID) REFERENCES USER(uID) ON DELETE CASCADE,
    FOREIGN KEY (sponsorID) REFERENCES SPONSOR_ORG(sponsorID) ON DELETE CASCADE
);

-- Sponsor catalog items
CREATE TABLE IF NOT EXISTS SPONSOR_CATALOG (
    catalogID INT PRIMARY KEY AUTO_INCREMENT,
    listingId INT NOT NULL,
    sponsorID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sponsorID) REFERENCES SPONSOR_ORG(sponsorID) ON DELETE CASCADE,
    UNIQUE KEY unique_listing_sponsor (listingId, sponsorID)
);

-- Catalog item images
CREATE TABLE IF NOT EXISTS CATALOG_IMAGES (
    imageID INT PRIMARY KEY AUTO_INCREMENT,
    link VARCHAR(500) NOT NULL,
    listingId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer orders
CREATE TABLE IF NOT EXISTS `ORDER` (
    orderID INT PRIMARY KEY AUTO_INCREMENT,
    uID INT NOT NULL,
    status INT DEFAULT 1,
    total DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    sponsorID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uID) REFERENCES USER(uID) ON DELETE CASCADE,
    FOREIGN KEY (sponsorID) REFERENCES SPONSOR_ORG(sponsorID) ON DELETE CASCADE
);

-- Individual order items
CREATE TABLE IF NOT EXISTS ORDER_ITEMS (
    itemID INT PRIMARY KEY AUTO_INCREMENT,
    listingId INT NOT NULL,
    orderID INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderID) REFERENCES `ORDER`(orderID) ON DELETE CASCADE
);

-- Login attempt logging
CREATE TABLE IF NOT EXISTS LOGIN_ATTEMPTS (
    attemptID INT PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL,
    username VARCHAR(50) NOT NULL,
    success BOOLEAN NOT NULL,
    uID INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uID) REFERENCES USER(uID) ON DELETE SET NULL
);

-- Password change tracking
CREATE TABLE IF NOT EXISTS PASSWORD_CHANGES (
    changeID INT PRIMARY KEY AUTO_INCREMENT,
    uId INT NOT NULL,
    changeType VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uId) REFERENCES USER(uID) ON DELETE CASCADE
);

-- Password reset codes
CREATE TABLE IF NOT EXISTS RESET_CODE (
    codeID INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE,
    INDEX idx_email (email),
    INDEX idx_code (code),
    INDEX idx_time (time)
);

-- Points tracking table
CREATE TABLE IF NOT EXISTS USER_POINTS (
    pointID INT PRIMARY KEY AUTO_INCREMENT,
    uID INT NOT NULL,
    sponsorID INT NOT NULL,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uID) REFERENCES USER(uID) ON DELETE CASCADE,
    FOREIGN KEY (sponsorID) REFERENCES SPONSOR_ORG(sponsorID) ON DELETE CASCADE,
    UNIQUE KEY unique_user_sponsor_points (uID, sponsorID)
);

-- Insert default admin user (password: admin123!)
INSERT IGNORE INTO USER (fname, lname, username, password, email, phone, usertype, status) 
VALUES ('Admin', 'User', 'admin', 'U2FsdGVkX1+YourEncryptedPasswordHere', 'admin@example.com', '1234567890', 0, TRUE);

-- Insert default account codes
INSERT IGNORE INTO SPONSOR_ORG (orgName, email, street, city, state, zip, pointsPerDollar) 
VALUES ('Default Admin Org', 'admin@example.com', '123 Admin St', 'Admin City', 'AC', '12345', 100);

INSERT IGNORE INTO ACCOUNT_CODE (code, sponsorID) VALUES 
('0000', 1), -- Admin code
('1111', 1), -- New sponsor org code  
('1730', 1); -- Special sponsor code