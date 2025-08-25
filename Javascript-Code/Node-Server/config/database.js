// Database configuration
// In production, these values should come from environment variables

const config = {
  development: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: process.env.DB_PORT || "3306",
    database: process.env.DB_NAME || "good_driver_incentive"
  },
  production: {
    host: process.env.DB_HOST || "groupfour-database.crvi1tvxyfsa.us-east-1.rds.amazonaws.com",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "cpsc4910group4",
    port: process.env.DB_PORT || "3306",
    database: process.env.DB_NAME || "new_schema"
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];