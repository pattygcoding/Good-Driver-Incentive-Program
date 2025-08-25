
var loginlogs = require('./logging.js');
var mysql = require('mysql');

describe("Login Audit Logging Tests", () => {



    test('Testing login audit system', () => {

            //get connection to be used in testing
        var connection = mysql.createConnection({
            host: "groupfour-database.crvi1tvxyfsa.us-east-1.rds.amazonaws.com",
            user: "admin",
            password: "cpsc4910group4",
            port: "3306",
            database: "new_schema"
        });

        var test_username = "testusername";

        var date = loginlogs.recordLogin(test_username, false, -1, connection);

        //check if recorded

        var sel_query = "SELECT date, username, success from new_schema.LOGIN_ATTEMPTS where date = \'" + date + "\';"

        connection.query(sel_query, function(err, result, fields) {
            if(err) console.log(err)

            const isEmpty = Object.keys( result ).length === 0;
            expect(isEmpty).toEqual(false);

            if( !isEmpty ) {
                expect(result[0].date).toEqual(date);
                expect(result[0].username).toEqual(test_username);
                expect(result[0].success).toEqual(0);
            }
        })

        connection.query("DELETE from new_schema.LOGIN_ATTEMPTS WHERE date = \'" + date + "\';");

        connection.end()
    });



});