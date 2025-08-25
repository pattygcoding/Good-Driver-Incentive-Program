module.exports = function( app, connection ) {

    logs = require('../logs/logging.js');
    crypt = require('../services/encryption.js');

    app.post('/login-attempt', (req, res) => {
        console.log('Recieved login attempt');
        console.log(req.body);
        // get input
        let username = req.body.username;
        let password = req.body.password;
        //make sure username & password exist
        if( username && password && !password.includes("\'") && !password.includes("\"") ) {
      
          var testing = false; //variable for testing fxns
      
          //clean username input to prevent SQL injections
          const clean_username = username.split(" ");
      
          //create accounts for testing
          if( testing ) {
      
            //get hashed password
            var hpass = crypt.getHash(password);
      
            //create new driver with hashed password
            // username: driver
            // password: driverpassword
            const driver_query = "insert into USER values (2, -1, 'Guy', 'Driver', 'driver', '" + hpass + "', 'driver@email.net', '0987654567', 0);";
      
            //create new sponsor with hashed password
            // username: sponsor
            // password: sponsorpassword
            const sponsor_query = "insert into USER values (3, -1, 'Girl', 'Sponsor', 'sponsor', '" + hpass + "', 'sponsor@email.net', '0987654569', 1);";
      
            // create new amin with hashed password
            // username: admin
            // password: adminpassword
            const admin_query = "insert into USER values (4, -1, 'Person', 'Admin', 'admin', '" + hpass + "', 'admin@email.net', '0987654561', 2);";
            // connection.query(admin_query);
          }
      
          var sel_query;
          //allow users to sign in via email
          if( clean_username[0].includes("@") ) {
            sel_query = "SELECT password, userType, uID, username, status from new_schema.USER where email = \"" + clean_username[0] + "\";";
          }
          else {
            sel_query = "SELECT password, userType, uID, username, status from new_schema.USER where username = \"" + clean_username[0] + "\";";
          }
      
      
          //poll db
          connection.query(sel_query, function(err, result, fields) {
            if(err) console.log(err);
            console.log(result);
            
            const isEmpty = Object.keys(result).length === 0;
      
            //case for successful login
            if( (!isEmpty) && crypt.validatePassword(password, result[0].password) ) {
              if(!result[0].status){
                console.log("Inactive user");
                logs.recordLogin(clean_username[0], false, -1, connection);
                res.send({success: false, msg: "Account Suspended. Contact Admin"});
              }else{
                session=req.session;
                session.userid=result[0].uID;
                console.log("Password Match!");
                logs.recordLogin(result[0].username, true, result[0].uID, connection);
                res.send({success: true, userType: result[0].userType});
              }
            }
            //case for unsuccessful logins
            else if (isEmpty) {
              console.log("Username/Email Not Recognized");
              logs.recordLogin(clean_username[0], false, -1, connection);
              res.send({success: false, msg: "Username/Email Not Recognized"});
            }
            else if (!isEmpty) {
              console.log("Username and Password did not match");
              logs.recordLogin(username, false, result[0].uID, connection);
              res.send({success: false, msg: "Username and Password did not match"});
            }
          });
        } 
        else {
          logs.recordLogin(username, false, -1, connection);
          res.send({success: false});
          console.log('no username/password.');
          res.end()
        }
      
      });
      
      app.get('/logout', (req, res) => {
        req.session.destroy();
        res.send({success: true});
      });
}